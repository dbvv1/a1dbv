using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;

namespace NativeEncounter.Editor
{
  // Applies only to the frozen encounter sources, never to unrelated project assets.
  public sealed class EncounterModelImport : AssetPostprocessor
  {
    static readonly HashSet<string> Actions = new HashSet<string> { "idle", "walk", "attack", "hurt", "death" };
    bool IsEncounter => assetPath == "Assets/Encounter/Inputs/blue-reactions.fbx"
      || assetPath == "Assets/Encounter/Inputs/amber.fbx"
      || assetPath == "Assets/Encounter/Inputs/blue-long.fbx";

    public static string Canonical(string takeName)
    {
      if (string.IsNullOrEmpty(takeName)) throw new InvalidOperationException("Missing FBX take name");
      var name = takeName.Split('|').Last();
      if (!Actions.Contains(name)) throw new InvalidOperationException("Unexpected FBX take: " + takeName);
      return name;
    }
    void OnPreprocessModel()
    {
      if (!IsEncounter) return;
      var importer = (ModelImporter)assetImporter;
      importer.animationType = ModelImporterAnimationType.Generic;
      importer.avatarSetup = ModelImporterAvatarSetup.CreateFromThisModel;
      importer.importAnimation = true;
      importer.preserveHierarchy = true;
      importer.optimizeGameObjects = false;
      importer.globalScale = 1;
      importer.materialImportMode = ModelImporterMaterialImportMode.None;
    }
    void OnPreprocessAnimation()
    {
      if (!IsEncounter) return;
      var importer = (ModelImporter)assetImporter;
      // Rebuild ranges from this import's TakeInfo, not last import's saved end-frame.
      var clips = importer.defaultClipAnimations;
      var names = new HashSet<string>();
      foreach (var clip in clips)
      {
        var name = Canonical(clip.takeName);
        if (!names.Add(name)) throw new InvalidOperationException("Duplicate canonical take: " + name);
        clip.name = name;
        clip.loopTime = name == "idle" || name == "walk";
        clip.loopPose = false;
        // This in-place source keeps root pose (especially death) in bone animation.
        // Real Generic import must verify the fall; do not substitute applyRootMotion.
        clip.lockRootRotation = true; clip.keepOriginalOrientation = true;
        clip.lockRootHeightY = true; clip.keepOriginalPositionY = true;
        clip.lockRootPositionXZ = true; clip.keepOriginalPositionXZ = true;
      }
      var expected = assetPath.EndsWith("blue-reactions.fbx") ? Actions
        : new HashSet<string> { "idle", "walk", "attack" };
      if (!names.SetEquals(expected)) throw new InvalidOperationException("Missing or extra encounter takes: " + assetPath);
      importer.clipAnimations = clips;
    }
  }
}
