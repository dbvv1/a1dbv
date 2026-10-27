using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;

namespace NativeEncounter.Editor
{
  // Run only in a new, authorized project after source staging and native FBX ModelImporter import.
  public static class PrepareEncounter
  {
    const string Inputs = "Assets/Encounter/Inputs";
    const string Output = "Assets/Encounter/Generated";
    static readonly string[] Actions = { "idle", "walk", "attack", "hurt", "death" };

    [MenuItem("Encounter/Create native scene (new output only)")]
    public static void Create()
    {
      if (SceneManager.GetActiveScene().isDirty)
        throw new InvalidOperationException("Save your current scene before creating the isolated encounter.");
      if (AssetDatabase.IsValidFolder(Output) || Directory.Exists(Output))
        throw new InvalidOperationException("Generated exists; do not overwrite the original scene. Use the revision command.");
      var model = AssetDatabase.LoadAssetAtPath<GameObject>(Inputs + "/blue-reactions.fbx");
      if (model == null) throw new InvalidOperationException("Stage blue-reactions.fbx and its source JSON, then finish ModelImporter import.");
      var amber = AssetDatabase.LoadAssetAtPath<GameObject>(Inputs + "/amber.fbx");
      if (amber == null) throw new InvalidOperationException("Stage amber.fbx and its source JSON, then finish ModelImporter import.");
      var imported = AssetDatabase.LoadAllAssetsAtPath(Inputs + "/blue-reactions.fbx").OfType<AnimationClip>().ToArray();
      foreach (var source in new[] { "blue-reactions", "amber" })
        if (!File.Exists(Inputs + "/" + source + ".source.json")) throw new FileNotFoundException("Missing source material metadata: " + source);
      foreach (var name in Actions)
        if (imported.Count(c => c.name == name) != 1)
          throw new InvalidOperationException("Expected one named source clip: " + name);
      var shader = WallShader();
      foreach (var prefix in new[] { "base", "changed" })
        foreach (var channel in new[] { "color", "normal", "roughness" })
          if (!File.Exists(Inputs + "/" + prefix + "_" + channel + ".png"))
            throw new FileNotFoundException("Run the existing material-authoring source first", prefix + "_" + channel);
      Directory.CreateDirectory(Output);
      AssetDatabase.Refresh();
      var controller = AnimatorController.CreateAnimatorControllerAtPath(Output + "/Guard.controller");
      var states = controller.layers[0].stateMachine;
      foreach (var name in Actions)
      {
        // Reference stable, canonical ModelImporter sub-assets; no disconnected .anim copies.
        var clip = imported.Single(c => c.name == name);
        var state = states.AddState(name); state.motion = clip;
        if (name == "idle") states.defaultState = state;
      }
      CreateActorPrefab(model, controller, "Guard", "blue-reactions");
      CreateActorPrefab(amber, controller, "AmberGuard", "amber");
      var left = CreateWallMaterial("LeftWall", "base", shader);
      var right = CreateWallMaterial("RightWall", "base", shader);
      var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
      Box("Floor", new Vector3(0, -0.15f, 0), new Vector3(12, 0.3f, 10), left);
      Box("LeftWall", new Vector3(-6, 1.5f, 0), new Vector3(0.3f, 3, 10), left);
      Box("RightWall", new Vector3(6, 1.5f, 0), new Vector3(0.3f, 3, 10), right);
      Box("FarWall", new Vector3(0, 1.5f, 5), new Vector3(12, 3, 0.3f), left);
      Box("NearWall", new Vector3(0, 0.4f, -5), new Vector3(12, 0.8f, 0.3f), left);
      var player = Spawn("Player", new Vector3(-1, 0, 0), true);
      var enemy = Spawn("Enemy", new Vector3(2, 0, 0), false);
      player.opponent = enemy; enemy.opponent = player;
      PrefabUtility.RecordPrefabInstancePropertyModifications(player);
      PrefabUtility.RecordPrefabInstancePropertyModifications(enemy);
      var camera = new GameObject("Camera").AddComponent<Camera>();
      camera.tag = "MainCamera"; camera.transform.position = new Vector3(0, 10, -10);
      camera.transform.LookAt(Vector3.zero); camera.gameObject.AddComponent<AudioListener>();
      var light = new GameObject("KeyLight").AddComponent<Light>();
      light.type = LightType.Directional; light.intensity = 1.2f;
      light.transform.rotation = Quaternion.Euler(40, -30, 0);
      RenderSettings.ambientLight = new Color(0.3f, 0.3f, 0.3f);
      if (!EditorSceneManager.SaveScene(scene, Output + "/Encounter.unity"))
        throw new InvalidOperationException("Scene save failed");
      AssetDatabase.SaveAssets();
      Validate();
      Debug.Log("Encounter prepared, not yet tested or built. Add this scene to the selected Build Profile.");
    }
    static void CreateActorPrefab(GameObject model, AnimatorController controller, string name, string source)
    {
      var root = new GameObject(name);
      try
      {
        var visual = (GameObject)PrefabUtility.InstantiatePrefab(model);
        visual.transform.SetParent(root.transform, false);
        BindCharacterMaterials(visual, source);
        var animators = visual.GetComponentsInChildren<Animator>(true);
        if (animators.Length != 1) throw new InvalidOperationException("Expected exactly one imported Animator; inspect importer configuration.");
        var animator = animators[0];
        animator.runtimeAnimatorController = controller;
        animator.applyRootMotion = false;
        PrefabUtility.RecordPrefabInstancePropertyModifications(animator);
        var motor = root.AddComponent<CharacterController>();
        motor.height = 1.8f; motor.center = new Vector3(0, 0.9f, 0); motor.radius = 0.3f;
        var actor = root.AddComponent<EncounterActor>(); actor.animator = animator;
        var prefab = PrefabUtility.SaveAsPrefabAsset(root, Output + "/" + name + ".prefab");
        if (prefab == null) throw new InvalidOperationException("Prefab save failed");
      }
      finally { UnityEngine.Object.DestroyImmediate(root); }
    }
    [Serializable] sealed class SourceMaterial { public string name; public float[] color; public float metallic; public float roughness; }
    [Serializable] sealed class SourceMesh { public string name; public string[] materials; }
    [Serializable] sealed class SourceAction { public string name; public float firstFrame; public float lastFrame; }
    [Serializable] sealed class SourceDescription { public string colorSpace; public float fps; public SourceAction[] actions; public SourceMaterial[] materials; public SourceMesh[] meshes; }
    static void BindCharacterMaterials(GameObject visual, string source)
    {
      var data = JsonUtility.FromJson<SourceDescription>(File.ReadAllText(Inputs + "/" + source + ".source.json"));
      if (data == null || data.colorSpace != "scene-linear" || data.materials == null || data.meshes == null) throw new InvalidDataException("Missing source material description");
      var materials = data.materials.ToDictionary(m => m.name, m =>
      {
        if (m.color == null || m.color.Length != 4) throw new InvalidDataException("Invalid material color: " + m.name);
        var material = new Material(WallShader()) { name = source + "_" + m.name };
        // Blender values are scene-linear; Unity shader Color properties take sRGB inputs.
        var color = new Color(m.color[0], m.color[1], m.color[2], m.color[3]).gamma;
        color.a = m.color[3];
        material.SetColor(material.HasProperty("_BaseColor") ? "_BaseColor" : "_Color", color);
        material.SetFloat("_Metallic", m.metallic);
        material.SetFloat(material.HasProperty("_Smoothness") ? "_Smoothness" : "_Glossiness", 1 - m.roughness);
        AssetDatabase.CreateAsset(material, Output + "/" + material.name + ".mat");
        return material;
      });
      foreach (var renderer in visual.GetComponentsInChildren<Renderer>(true))
      {
        var mesh = data.meshes.Single(m => m.name == renderer.name);
        renderer.sharedMaterials = mesh.materials.Select(name => materials[name]).ToArray();
        PrefabUtility.RecordPrefabInstancePropertyModifications(renderer);
      }
    }
    static AnimationClip FindClip(string name)
    {
      return AssetDatabase.LoadAllAssetsAtPath(Inputs + "/blue-reactions.fbx")
        .OfType<AnimationClip>().SingleOrDefault(c => c.name == name);
    }
    [MenuItem("Encounter/Reimport source models and validate references")]
    public static void ReimportModels()
    {
      foreach (var source in new[] { "blue-reactions", "amber" })
        AssetDatabase.ImportAsset(Inputs + "/" + source + ".fbx", ImportAssetOptions.ForceUpdate);
      Validate();
      // A changed source take refreshes its range in the postprocessor. Existing controller
      // references must still point to the imported sub-assets; a lost reference is a failure.
    }
    static Shader WallShader()
    {
      var pipeline = GraphicsSettings.currentRenderPipeline;
      string name;
      if (pipeline == null) name = "Standard";
      else if (pipeline.GetType().Name.Contains("Universal")) name = "Universal Render Pipeline/Lit";
      else throw new InvalidOperationException("This scaffold supports Built-in or URP only; do not switch an existing project to fit it.");
      var shader = Shader.Find(name);
      if (shader == null) throw new InvalidOperationException("Required shader missing: " + name);
      return shader;
    }
    static void Box(string name, Vector3 position, Vector3 scale, Material material)
    {
      var box = GameObject.CreatePrimitive(PrimitiveType.Cube); box.name = name;
      box.transform.position = position; box.transform.localScale = scale;
      box.GetComponent<Renderer>().sharedMaterial = material;
    }
    static EncounterActor Spawn(string name, Vector3 position, bool player)
    {
      var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(Output + (player ? "/Guard.prefab" : "/AmberGuard.prefab"));
      var instance = (GameObject)PrefabUtility.InstantiatePrefab(prefab);
      instance.name = name; instance.transform.position = position;
      PrefabUtility.RecordPrefabInstancePropertyModifications(instance.transform);
      var actor = instance.GetComponent<EncounterActor>(); actor.player = player;
      // An intentional instance override to preserve during later source revisions.
      actor.speed = player ? 2.0f : 1.2f;
      PrefabUtility.RecordPrefabInstancePropertyModifications(actor);
      return actor;
    }
    static Material CreateWallMaterial(string name, string prefix, Shader shader)
    {
      var material = new Material(shader) { name = name };
      AssetDatabase.CreateAsset(material, Output + "/" + name + ".mat");
      BindWall(material, prefix); return material;
    }
    static Texture2D ImportTexture(string path, bool color, bool normal)
    {
      AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceSynchronousImport);
      var importer = AssetImporter.GetAtPath(path) as TextureImporter;
      if (importer == null) throw new InvalidOperationException("Not a texture: " + path);
      importer.textureType = normal ? TextureImporterType.NormalMap : TextureImporterType.Default;
      importer.sRGBTexture = color; importer.mipmapEnabled = true;
      importer.wrapMode = TextureWrapMode.Repeat; importer.SaveAndReimport();
      return AssetDatabase.LoadAssetAtPath<Texture2D>(path);
    }
    static void BindWall(Material material, string prefix)
    {
      var color = ImportTexture(Inputs + "/" + prefix + "_color.png", true, false);
      var normal = ImportTexture(Inputs + "/" + prefix + "_normal.png", false, true);
      var maskPath = Output + "/" + prefix + "_metallic-smoothness.png";
      if (!File.Exists(maskPath))
      {
        var roughness = new Texture2D(2, 2, TextureFormat.RGBA32, false, true);
        try
        {
          if (!roughness.LoadImage(File.ReadAllBytes(Inputs + "/" + prefix + "_roughness.png")))
            throw new InvalidDataException("Could not decode roughness");
          var pixels = roughness.GetPixels32();
          for (int i = 0; i < pixels.Length; i++) pixels[i] = new Color32(0, 255, 0, (byte)(255 - pixels[i].r));
          roughness.SetPixels32(pixels); roughness.Apply();
          File.WriteAllBytes(maskPath, roughness.EncodeToPNG());
        }
        finally { UnityEngine.Object.DestroyImmediate(roughness); }
      }
      var mask = ImportTexture(maskPath, false, false);
      material.SetTexture(material.HasProperty("_BaseMap") ? "_BaseMap" : "_MainTex", color);
      material.SetTexture("_BumpMap", normal); material.EnableKeyword("_NORMALMAP");
      material.SetTexture("_MetallicGlossMap", mask);
      material.EnableKeyword(material.HasProperty("_BaseMap") ? "_METALLICSPECGLOSSMAP" : "_METALLICGLOSSMAP");
      if (material.HasProperty("_Smoothness")) material.SetFloat("_Smoothness", 1);
      if (material.HasProperty("_GlossMapScale")) material.SetFloat("_GlossMapScale", 1);
      EditorUtility.SetDirty(material);
    }
    [MenuItem("Encounter/Revise right wall only")]
    public static void ReviseRightWall()
    {
      var material = AssetDatabase.LoadAssetAtPath<Material>(Output + "/RightWall.mat");
      if (material == null) throw new InvalidOperationException("Create the scene first");
      BindWall(material, "changed"); AssetDatabase.SaveAssets();
      // Keeps the material asset identity; scene references and LeftWall are unchanged.
    }
    [MenuItem("Encounter/Validate native animation assets")]
    public static void Validate()
    {
      var colorProbe = new Color(0.5f, 0.5f, 0.5f, 0.25f).gamma;
      if (Mathf.Abs(colorProbe.r - 0.735357f) > 0.0001f || colorProbe.a != 0.25f)
        throw new InvalidOperationException("Unexpected linear-to-sRGB Color contract");
      var source = JsonUtility.FromJson<SourceDescription>(File.ReadAllText(Inputs + "/blue-reactions.source.json"));
      if (source == null || source.fps <= 0 || source.actions == null) throw new InvalidDataException("Missing source action ranges");
      foreach (var name in Actions)
      {
        var clip = FindClip(name);
        if (clip == null || clip.legacy || clip.length <= 0) throw new InvalidOperationException("Invalid imported clip: " + name);
        var action = source.actions.Single(a => a.name == name);
        var expectedSeconds = (action.lastFrame - action.firstFrame) / source.fps;
        if (Mathf.Abs(clip.length - expectedSeconds) > 0.001f)
          throw new InvalidOperationException("Imported duration differs from current source: " + name);
        var loops = AnimationUtility.GetAnimationClipSettings(clip).loopTime;
        if (loops != (name == "idle" || name == "walk")) throw new InvalidOperationException("Wrong loop policy: " + name);
      }
      var controller = AssetDatabase.LoadAssetAtPath<AnimatorController>(Output + "/Guard.controller");
      if (controller == null || controller.layers.Length != 1) throw new InvalidOperationException("Missing native controller/layer");
      var states = controller.layers[0].stateMachine.states;
      foreach (var name in Actions)
      {
        var matches = states.Where(s => s.state.name == name).ToArray();
        var native = FindClip(name);
        if (matches.Length != 1 || matches[0].state.motion != native)
          throw new InvalidOperationException("State does not reference its current imported clip: " + name);
      }
      foreach (var name in new[] { "Guard", "AmberGuard" })
      {
        var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(Output + "/" + name + ".prefab");
        var actor = prefab != null ? prefab.GetComponent<EncounterActor>() : null;
        if (actor == null || actor.animator == null || actor.animator.runtimeAnimatorController != controller)
          throw new InvalidOperationException("Missing actor/controller: " + name);
      }
      if (SceneManager.GetActiveScene().path == Output + "/Encounter.unity")
      {
        var actors = SceneManager.GetActiveScene().GetRootGameObjects()
          .SelectMany(root => root.GetComponentsInChildren<EncounterActor>(true)).ToArray();
        var player = actors.Single(a => a.player);
        var enemy = actors.Single(a => !a.player);
        if (player.opponent != enemy || enemy.opponent != player || !Mathf.Approximately(enemy.speed, 1.2f))
          throw new InvalidOperationException("Scene instance references/override missing; save and reopen before accepting");
        if (!Application.isPlaying && (Vector3.Distance(player.transform.position, new Vector3(-1, 0, 0)) > 0.001f
          || Vector3.Distance(enemy.transform.position, new Vector3(2, 0, 0)) > 0.001f))
          throw new InvalidOperationException("Scene spawn transform override changed");
      }
      Debug.Log("Native asset contract checked; PlayMode, appearance, physics and Player build still require real runs.");
    }
  }
}
