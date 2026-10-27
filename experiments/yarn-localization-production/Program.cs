using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Yarn;
using Yarn.Compiler;
using Yarn.Markup;

static class Probe
{
  static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true, WriteIndented = true };
  static readonly LineParser Parser = new();
  static readonly Regex Placeholder = new(@"\{(\d+)\}");
  static Dictionary<string, Speaker> Speakers = new();
  record Speaker(string Id, Dictionary<string, string> Names);
  record Translation(string Text, string ReviewedSource);
  record AuthorLine(string Id, string Text, string Speaker, string Context, string Stamp, string RawText);
  record Bundle(Yarn.Program Program, Dictionary<string, AuthorLine> Lines);
  record Shown(string Id, string Speaker, string Name, string Text);
  record ShownOption(int Id, bool Available, Shown Line);
  record ChoiceRun(ShownOption[] Offered, ShownOption[] Displayed, List<Shown> Lines, string Route);

  static void Require(bool condition, string message)
  {
    if (!condition) throw new InvalidDataException(message);
  }

  static Bundle Compile(string source)
  {
    var result = Compiler.Compile(CompilationJob.CreateFromString("hangar.yarn", source));
    var errors = result.Diagnostics.Where(d => d.Severity == Diagnostic.DiagnosticSeverity.Error).ToArray();
    Require(errors.Length == 0, "Compiler errors: " + string.Join("; ", errors.Select(d => d.ToString())));
    Require(result.Program != null && result.StringTable != null, "Compiler returned no runnable output");
    var sourceLines = source.Replace("\r\n", "\n").Split('\n');
    var exported = new Dictionary<string, AuthorLine>();
    foreach (var (id, info) in result.StringTable!)
    {
      Require(!info.isImplicitTag && id.StartsWith("line:"), "Explicit stable line ID required");
      Require(info.text != null && info.shadowLineID == null, "This small exporter does not handle shadow lines");
      var parsed = Parser.ParseStringAndIncludeMarkupDiagnostics(info.text!, "zh-Hans");
      Require(parsed.diagnostics.Count == 0, "Invalid source markup");
      Require(parsed.markup.TryGetAttributeWithName("character", out var character), "Source speaker required");
      var rawSpeaker = character.Properties["name"].StringValue;
      Require(Speakers.ContainsKey(rawSpeaker), "Unknown speaker: " + rawSpeaker);
      var body = parsed.markup.Text.Remove(character.Position, character.Length).TrimStart();
      var context = info.metadata.SingleOrDefault(t => t.StartsWith("context:"));
      Require(context != null, "Author context required");
      // Conservative review baseline: author expression, speaker and context are all included.
      // Moving a line alone does not change it. This is project policy, not a Yarn approval API.
      var authorLine = sourceLines[info.lineNumber - 1].Trim();
      Require(authorLine.Contains("#" + id), "Compiler/source line mapping differs");
      var stamp = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(info.nodeName + "\n" + authorLine))).ToLowerInvariant();
      exported.Add(id, new(id, body, Speakers[rawSpeaker].Id, context!, stamp, info.text!));
    }
    return new(result.Program!, exported);
  }

  static Dictionary<string, Translation> ReadTranslations(string path) =>
    JsonSerializer.Deserialize<Dictionary<string, Translation>>(File.ReadAllText(path), Json)
      ?? throw new InvalidDataException("Missing translation table");

  static string[] NeedsReview(Bundle bundle, Dictionary<string, Translation> table) =>
    bundle.Lines.Values.Where(line => !table.TryGetValue(line.Id, out var entry) || entry.ReviewedSource != line.Stamp)
      .Select(line => line.Id).OrderBy(id => id, StringComparer.Ordinal).ToArray();

  static HashSet<string> Slots(string text) => Placeholder.Matches(text).Select(m => m.Groups[1].Value).ToHashSet();

  static void Validate(Bundle bundle, Dictionary<string, Translation> table)
  {
    Require(NeedsReview(bundle, table).Length == 0, "Translation missing or source review stale");
    foreach (var line in bundle.Lines.Values)
    {
      var text = table[line.Id].Text;
      Require(!string.IsNullOrWhiteSpace(text), "Empty translation");
      Require(Slots(text).SetEquals(Slots(line.Text)), "Translation placeholder mismatch: " + line.Id);
      var parsed = Parser.ParseStringAndIncludeMarkupDiagnostics(text, "en");
      Require(parsed.diagnostics.Count == 0, "Invalid translation markup");
      Require(!parsed.markup.TryGetAttributeWithName("character", out _), "This body-only export uses sidecar speakers");
    }
  }

  static Shown Localize(Line line, Bundle bundle, Dictionary<string, Translation> table, string locale)
  {
    var data = bundle.Lines[line.ID]; // ID and substitutions come from the actual VM.
    var text = locale == "en" ? table[line.ID].Text : data.Text;
    var expanded = LineParser.ExpandSubstitutions(text, line.Substitutions);
    var parsed = Parser.ParseStringAndIncludeMarkupDiagnostics(expanded, locale);
    Require(parsed.diagnostics.Count == 0, "Runtime markup error");
    var speaker = Speakers.Values.Single(s => s.Id == data.Speaker);
    return new(line.ID, data.Speaker, speaker.Names[locale], parsed.markup.Text);
  }

  static List<Shown> Play(Bundle bundle, Dictionary<string, Translation> table, string locale)
  {
    // Validate the complete candidate before any line enters the real VM consumer.
    if (locale == "en") Validate(bundle, table);
    Require(locale is "en" or "zh-Hans", "Unsupported locale");
    var shown = new List<Shown>();
    var dialogue = new Dialogue(new MemoryVariableStore());
    dialogue.SetProgram(bundle.Program);
    dialogue.LogErrorMessage = message => throw new InvalidDataException(message);
    dialogue.OptionsHandler = _ => throw new InvalidDataException("Unexpected choice in this linear fixture");
    dialogue.CommandHandler = _ => throw new InvalidDataException("Unexpected game command in this fixture");
    dialogue.LineHandler = line => shown.Add(Localize(line, bundle, table, locale));
    var completed = false;
    dialogue.DialogueCompleteHandler = () => completed = true;
    dialogue.SetNode("hangar_02");
    do { dialogue.Continue(); } while (dialogue.IsActive);
    Require(completed, "VM did not complete");
    return shown;
  }

  // For a custom core consumer only. Unity projects normally keep the official
  // OptionsPresenter/OptionItem. These IDs belong to the current option batch,
  // not to a saved story or another dialogue session.
  static void SelectAvailable(Dialogue dialogue, OptionSet current, int optionId)
  {
    var matches = current.Options.Where(option => option.ID == optionId).ToArray();
    Require(matches.Length == 1 && matches[0].IsAvailable, "Unknown or unavailable option");
    dialogue.SetSelectedOption(matches[0].ID);
  }

  static ChoiceRun PlayChoices(Bundle bundle, Dictionary<string, Translation> table, string locale,
    Action<Dialogue, OptionSet, ShownOption[]> select,
    bool hasKey = false, bool canWalk = true, bool hideUnavailable = true, bool reverse = false)
  {
    if (locale == "en") Validate(bundle, table);
    Require(locale is "en" or "zh-Hans", "Unsupported locale");
    var variables = new MemoryVariableStore();
    variables.SetValue("$has_key", hasKey);
    variables.SetValue("$can_walk", canWalk);
    variables.SetValue("$route", "none");
    var dialogue = new Dialogue(variables);
    dialogue.SetProgram(bundle.Program);
    dialogue.LogErrorMessage = message => throw new InvalidDataException(message);
    dialogue.CommandHandler = _ => throw new InvalidDataException("Unexpected game command in choice fixture");
    var lines = new List<Shown>();
    dialogue.LineHandler = line => lines.Add(Localize(line, bundle, table, locale));
    ShownOption[] offered = [], displayed = [];
    var batches = 0;
    dialogue.OptionsHandler = current =>
    {
      Require(++batches == 1, "This fixture expects one option batch");
      offered = current.Options.Select(option => new ShownOption(option.ID, option.IsAvailable,
        Localize(option.Line, bundle, table, locale))).ToArray();
      // Filtering and reordering change presentation only; retain the original ID.
      displayed = offered.Where(option => !hideUnavailable || option.Available).ToArray();
      if (reverse) Array.Reverse(displayed);
      select(dialogue, current, displayed); // Synchronous test input, not a Unity button callback.
    };
    var completed = false;
    dialogue.DialogueCompleteHandler = () => completed = true;
    dialogue.SetNode("hangar_routes");
    do { dialogue.Continue(); } while (dialogue.IsActive);
    Require(completed && batches == 1, "Choice VM did not finish exactly one option batch");
    Require(variables.TryGetValue<string>("$route", out var route), "VM route variable missing");
    return new(offered, displayed, lines, route!);
  }

  static void Reject(Action action)
  {
    try { action(); } catch (InvalidDataException) { return; }
    throw new Exception("Invalid candidate was accepted");
  }

  static int Main(string[] args)
  {
    try
    {
      var root = args.Length > 0 ? Path.GetFullPath(args[0]) : Directory.GetCurrentDirectory();
      var content = Path.Combine(root, "content");
      Speakers = JsonSerializer.Deserialize<Dictionary<string, Speaker>>(File.ReadAllText(Path.Combine(content, "speakers.json")), Json)!;
      var source = File.ReadAllText(Path.Combine(content, "base.yarn"));
      var revisedSource = File.ReadAllText(Path.Combine(content, "revised.yarn"));
      var baseline = Compile(source);
      var revised = Compile(revisedSource);
      var english = ReadTranslations(Path.Combine(content, "base.en.json"));
      var revisedEnglish = ReadTranslations(Path.Combine(content, "revised.en.json"));
      var choices = Compile(File.ReadAllText(Path.Combine(content, "choices.yarn")));
      var choicesEnglish = ReadTranslations(Path.Combine(content, "choices.en.json"));
      var review = NeedsReview(revised, english);
      var tests = new (string Name, Action Body)[] {
        ("compiler-to-real-VM-bilingual", () => {
          var zh = Play(baseline, english, "zh-Hans"); var en = Play(baseline, english, "en");
          Require(zh.Count == 6 && en.Count == 6, "Expected six VM-dispatched lines");
          Require(zh.Select(x => x.Id).SequenceEqual(en.Select(x => x.Id)), "Locale changed line identity");
          Require(zh[1].Text.Contains("2") && en[1].Text.Contains("2"), "VM substitution lost");
          Require(zh[0].Name == "领航员" && en[0].Name == "Navigator", "Sidecar/name consumer missing");
          Require(baseline.Lines[en[0].Id].RawText.StartsWith("Navigator:"), "Compiler speaker prefix lost");
        }),
        ("revision-review-then-real-VM", () => {
          Require(review.SequenceEqual(new[] { "line:hangar_02_020", "line:hangar_02_040", "line:hangar_02_050", "line:hangar_02_070" }), "Wrong re-review scope");
          Reject(() => Play(revised, english, "en"));
          var rows = Play(revised, revisedEnglish, "en");
          Require(rows.Count == 7 && rows[1].Text.Contains("2 fuses"), "Revised text not consumed");
          Require(rows[3].Speaker == "navigator" && rows[4].Text == "First, switch off the power.", "Speaker/context update not consumed");
        }),
        ("missing-placeholder-and-translation", () => {
          var broken = new Dictionary<string, Translation>(english);
          broken["line:hangar_02_020"] = broken["line:hangar_02_020"] with { Text = "Need parts." };
          Reject(() => Play(baseline, broken, "en"));
          broken = new(english); broken.Remove("line:hangar_02_030");
          Reject(() => Play(baseline, broken, "en"));
        }),
        ("missing-sidecar-speaker", () => Reject(() => Compile(source.Replace("Navigator:", "Unknown:")))),
        ("duplicate-and-implicit-ID", () => {
          Reject(() => Compile(source.Replace("#line:hangar_02_020", "#line:hangar_02_010")));
          Reject(() => Compile(source.Replace(" #line:hangar_02_020", "")));
        }),
        ("missing-source", () => {
          try { File.ReadAllText(Path.Combine(content, "absent.yarn")); }
          catch (FileNotFoundException) { return; }
          throw new Exception("Missing source unexpectedly exists");
        }),
        ("filtered-button-index-reproduces-wrong-branch", () => {
          // Deliberately wrong adapter: the first displayed button is NOT option 0.
          var wrong = PlayChoices(choices, choicesEnglish, "en", (d, _, _) => d.SetSelectedOption(0));
          var right = PlayChoices(choices, choicesEnglish, "en",
            (d, current, shown) => SelectAvailable(d, current, shown[0].Id));
          Require(wrong.Displayed.Length == 1 && wrong.Displayed[0].Id == 1
            && wrong.Displayed[0].Line.Id == "line:route_stairs", "Expected a filtered first button");
          Require(!wrong.Offered[0].Available && wrong.Route == "hatch"
            && wrong.Lines.Any(line => line.Id == "line:route_hatch_result"), "Wrong-ID counterexample not reproduced");
          Require(right.Route == "stairs" && right.Lines.Any(line => line.Id == "line:route_stairs_result"),
            "Original option ID did not reach the displayed route");
          Console.WriteLine($"CHOICE displayed={wrong.Displayed[0].Line.Id} originalID=1 wrongSubmit=0 route={wrong.Route}; correctSubmit=1 route={right.Route}");
        }),
        ("localized-filtered-and-reordered-options-retain-identity", () => {
          foreach (var locale in new[] { "zh-Hans", "en" }) {
            var filtered = PlayChoices(choices, choicesEnglish, locale,
              (d, current, shown) => SelectAvailable(d, current, shown[0].Id));
            var reordered = PlayChoices(choices, choicesEnglish, locale,
              (d, current, shown) => SelectAvailable(d, current, shown[0].Id), hasKey: true, reverse: true);
            var hatch = PlayChoices(choices, choicesEnglish, locale,
              (d, current, shown) => SelectAvailable(d, current, shown[0].Id), hasKey: true, canWalk: false);
            Require(filtered.Route == "stairs" && reordered.Route == "stairs" && hatch.Route == "hatch",
              "Locale, filtering or display order changed the selected branch");
            Require(reordered.Displayed.Select(option => option.Id).SequenceEqual(new[] { 1, 0 }), "Reorder was not exercised");
            Require(hatch.Displayed[0].Line.Text.Contains("2")
              && hatch.Displayed[0].Line.Name == (locale == "en" ? "Navigator" : "领航员"), "Option localization lost VM substitution or speaker");
          }
        }),
        ("unavailable-and-unknown-options-reject-before-VM-selection", () => {
          var result = PlayChoices(choices, choicesEnglish, "en", (d, current, shown) => {
            Require(shown.Length == 2 && !shown[0].Available, "Expected disabled option to remain visible");
            Reject(() => SelectAvailable(d, current, -1));
            Reject(() => SelectAvailable(d, current, 99));
            Reject(() => SelectAvailable(d, current, shown[0].Id));
            SelectAvailable(d, current, shown[1].Id); // Same pending VM still accepts a valid choice.
          }, hideUnavailable: false);
          Require(result.Route == "stairs" && !result.Lines.Any(line => line.Id == "line:route_hatch_result"),
            "Rejected selection entered the hidden branch");
        }),
        ("no-available-option-explicitly-falls-through", () => {
          var result = PlayChoices(choices, choicesEnglish, "en", (d, current, shown) => {
            Require(shown.Length == 0 && current.Options.All(option => !option.IsAvailable), "Expected no available choice");
            // This fixture chooses Yarn's no-selection fallthrough policy, not option 0.
            d.SetSelectedOption(Dialogue.NoOptionSelected);
          }, canWalk: false);
          Require(result.Route == "none" && result.Lines.Select(line => line.Id)
            .SequenceEqual(new[] { "line:route_prompt", "line:route_end" }), "No-option path entered a branch or stopped early");
        }),
        ("choice-localization-rejects-missing-text-and-parameter", () => {
          var broken = new Dictionary<string, Translation>(choicesEnglish);
          broken.Remove("line:route_stairs");
          Action<Dialogue, OptionSet, ShownOption[]> shouldNotSelect = (_, _, _) => throw new Exception("Invalid choice table reached the VM");
          Reject(() => PlayChoices(choices, broken, "en", shouldNotSelect));
          broken = new(choicesEnglish);
          broken["line:route_hatch"] = broken["line:route_hatch"] with { Text = "Open the hatch." };
          Reject(() => PlayChoices(choices, broken, "en", shouldNotSelect));
        })
      };
      foreach (var test in tests) { test.Body(); Console.WriteLine("PASS " + test.Name); }
      var output = Path.Combine(root, ".work"); Directory.CreateDirectory(output);
      File.WriteAllText(Path.Combine(output, "author-export.json"), JsonSerializer.Serialize(baseline.Lines, Json));
      var reviewDetails = review.Select(id => {
        var reasons = new List<string>();
        if (!baseline.Lines.TryGetValue(id, out var previous)) reasons.Add("new-line");
        else {
          var current = revised.Lines[id];
          if (previous.Text != current.Text) reasons.Add("text");
          if (previous.Speaker != current.Speaker) reasons.Add("speaker");
          if (previous.Context != current.Context) reasons.Add("context");
          if (reasons.Count == 0) reasons.Add("author-expression-or-metadata");
        }
        return new { id, reasons };
      }).ToArray();
      File.WriteAllText(Path.Combine(output, "review-queue.json"), JsonSerializer.Serialize(reviewDetails, Json));
      foreach (var locale in new[] { "zh-Hans", "en" })
        File.WriteAllText(Path.Combine(output, locale + ".json"), JsonSerializer.Serialize(Play(revised, revisedEnglish, locale), Json));
      Console.WriteLine($"{tests.Length} checks passed; real Yarn compiler + Dialogue VM; Unity UI/voice not run.");
      Console.WriteLine("Review queue: " + string.Join(", ", review));
      foreach (var row in Play(revised, revisedEnglish, "en")) Console.WriteLine($"{row.Id} | {row.Name}: {row.Text}");
      return 0;
    }
    catch (Exception error) { Console.Error.WriteLine(error.Message); return 1; }
  }
}
