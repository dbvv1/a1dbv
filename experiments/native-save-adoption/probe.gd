extends Node

var failed := false
const SLOT = "user://original.json"

func check(ok: bool, message: String) -> void:
	if not ok:
		failed = true
		printerr("SAVE_FAILED: " + message)

func frames(count: int) -> void:
	for i in count:
		await get_tree().process_frame

func click_box(box: Node) -> void:
	var event := InputEventMouseButton.new()
	event.button_index = MOUSE_BUTTON_LEFT
	event.pressed = true
	box.call("_input_event", get_viewport(), event, 0)
	event.pressed = false
	box.call("_input", event)

func _ready() -> void:
	run.call_deferred()

func run() -> void:
	await frames(2)
	var args := OS.get_cmdline_user_args()
	if args.size() != 1:
		printerr("SAVE_FAILED: expected one phase")
		get_tree().quit(2)
		return
	var phase := args[0]
	if phase not in ["official-save", "official-load", "save", "load-v1", "fresh-v2", "fresh-v2-migrated", "load-v2-unmigrated", "load-v2-migrated"]:
		printerr("SAVE_FAILED: unknown phase")
		get_tree().quit(2)
		return
	var scene := get_tree().current_scene
	if phase.begins_with("official-"):
		await official(scene, phase)
	else:
		await savekit(scene, phase)
	print("SAVE_RESULT phase=%s failed=%s" % [phase, failed])
	get_tree().quit.call_deferred(1 if failed else 0)

func official(scene: Node, phase: String) -> void:
	var player := scene.get_node("Game/Player")
	var buttons := scene.get_node("Control/VBoxContainer/SaveLoad")
	if phase == "official-save":
		player.set("position", Vector2(200, 80))
		player.set("health", 63.0)
		get_tree().get_nodes_in_group("enemy")[0].queue_free()
		await frames(2)
		buttons.get_node("SaveJSON").emit_signal("pressed")
		check(FileAccess.file_exists("user://save_json.json"), "official file written")
	elif phase == "official-load":
		buttons.get_node("LoadJSON").emit_signal("pressed")
		await frames(2)
		check(Vector2(player.get("position")).distance_to(Vector2(200, 80)) < 0.1, "official position restored")
		check(player.get("health") == 63.0, "official health restored")
		check(player.get_node("ProgressBar").get("value") == 63.0, "actual health UI consumes restoration")
		check(get_tree().get_nodes_in_group("enemy").size() == 2, "official enemy collection restored")
		Input.action_press("move_right")
		await frames(6)
		Input.action_release("move_right")
		check(Vector2(player.get("position")).x > 205, "restored official player continues movement")
	else:
		check(false, "unknown official phase")

func savekit(scene: Node, phase: String) -> void:
	var manager := get_node("/root/SaveManager")
	var red := scene.get_node("RedBox")
	var green := scene.get_node("GreenBox")
	var notes := scene.get_node("UILayer/NotesPanel/MarginContainer/VBoxContainer/NotesEdit")
	if phase == "save":
		click_box(red)
		click_box(red)
		red.set("position", Vector2(300, 180))
		notes.set("text", "Keep the player's decision")
		scene.get_node("BlueBox").queue_free()
		await frames(2)
		check((red.get("data") as Resource).get("click_count") == 2, "original input handler changed resource")
		check(manager.call("save_scene_tree_to_disk", SLOT) == OK, "native serializer wrote original")
	elif phase.begins_with("fresh-v2"):
		check((green.get("data") as Resource).get("click_count") == 1, "new game uses new authored default")
	else:
		check(manager.call("load_scene_tree_from_file", SLOT) == OK, "native deserializer loaded original")
		await frames(2)
		check(Vector2(red.get("position")).distance_to(Vector2(300, 180)) < 0.1, "red position restored")
		check((red.get("data") as Resource).get("click_count") == 2, "red interaction state restored")
		check((green.get("data") as Resource).get("click_count") == 0, "untouched old green remains zero")
		check((green.get("_count_label") as Label).text.ends_with("\n0"), "original UI consumes old zero")
		check(not scene.has_node("BlueBox"), "removed box stays removed")
		check(notes.get("text") == "Keep the player's decision", "notes restored")
		click_box(red)
		check((red.get("data") as Resource).get("click_count") == 3, "restored object continues original interaction")
		check(manager.call("save_scene_tree_to_disk", "user://continued.json") == OK, "continued save writes separately")
		check(manager.call("load_scene_tree_from_file", SLOT) == OK, "repeated load succeeds")
		await frames(2)
		check((red.get("data") as Resource).get("click_count") == 2, "load assigns state, not another click")
