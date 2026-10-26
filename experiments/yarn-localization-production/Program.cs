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
    dialogue.LineHandler = line =>
    {
      var data = bundle.Lines[line.ID]; // ID and substitutions are emitted by Yarn's actual VM.
      var text = locale == "en" ? table[line.ID].Text : data.Text;
      var expanded = LineParser.ExpandSubstitutions(text, line.Substitutions);
      var parsed = Parser.ParseStringAndIncludeMarkupDiagnostics(expanded, locale);
      Require(parsed.diagnostics.Count == 0, "Runtime markup error");
      var speaker = Speakers.Values.Single(s => s.Id == data.Speaker);
      shown.Add(new(line.ID, data.Speaker, speaker.Names[locale], parsed.markup.Text));
    };
    var completed = false;
    dialogue.DialogueCompleteHandler = () => completed = true;
    dialogue.SetNode("hangar_02");
    do { dialogue.Continue(); } while (dialogue.IsActive);
    Require(completed, "VM did not complete");
    return shown;
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
