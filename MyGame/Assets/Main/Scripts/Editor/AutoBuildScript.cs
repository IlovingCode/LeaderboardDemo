using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;

public class AutoBuildScript : MonoBehaviour
{

    [MenuItem("AutoBuild/ClientWebGL")]
    public static void BuildClientWebGL()
    {
        PlayerSettings.SetScriptingDefineSymbolsForGroup(
            BuildTargetGroup.WebGL, string.Empty);
        Build("Client", BuildTarget.WebGL);
    }

    [MenuItem("AutoBuild/ClientWin32")]
    public static void BuildClientWin32()
    {
        PlayerSettings.SetScriptingDefineSymbolsForGroup(
            BuildTargetGroup.Standalone, string.Empty);
        Build("Client/Client.exe", BuildTarget.StandaloneWindows64);
    }

    [MenuItem("AutoBuild/Server")]
    public static void BuildServer()
    {
        PlayerSettings.SetScriptingDefineSymbolsForGroup(
            BuildTargetGroup.Standalone, "SERVER");
        Build("Server/Server.exe", BuildTarget.StandaloneWindows64);
    }

    static void Build(string folder, BuildTarget target)
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.scenes = EditorBuildSettingsScene
        .GetActiveSceneList(EditorBuildSettings.scenes);
        buildPlayerOptions.locationPathName = folder.Insert(0, "./builds/");
        buildPlayerOptions.target = target;
        buildPlayerOptions.options = BuildOptions.None;
        BuildPipeline.BuildPlayer(buildPlayerOptions);
    }
}
