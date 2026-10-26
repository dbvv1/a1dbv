extends Node

var failed = false

func check(ok: bool, message: String):
	if not ok:
		failed = true
		printerr("DELIVERY_FAILED: " + message)

func frames(count: int):
	for i in count:
		await get_tree().process_frame

func _ready():
	seed(1234)
	initialize_content.call_deferred()

func initialize_content():
	await frames(2)
	var game = get_tree().current_scene
	var title = FileAccess.get_file_as_string("res://stage_title.txt").strip_edges()
	game.get_node("HUD/MessageLabel").text = title
	var args = OS.get_cmdline_user_args()
	if args.is_empty() or args[0] != "smoke":
		return
	if args.size() != 5:
		printerr("DELIVERY_FAILED: expected smoke, title, mode, speed, version")
		get_tree().quit(2)
		return
	check(OS.has_feature("editor") == (args[2] == "editor"), "correct editor/export consumer")
	check(OS.has_feature("debug") == (args[2] != "release"), "correct debug/release artifact")
	check(title == args[1], "packaged title consumed by actual HUD")
	if args[2] != "editor":
		check(not FileAccess.file_exists("res://unreleased/bonus_level.json"), "unreleased JSON excluded")
	check(ProjectSettings.get_setting("application/config/version", "") == args[4], "packaged application version")
	check(game.get_node("Player/AnimatedSprite2D").sprite_frames.get_frame_texture("right", 0) != null, "player texture")
	check(game.get_node("Music").stream != null, "music resource")
	game.get_node("HUD/StartButton").pressed.emit()
	await frames(2)
	var player = game.get_node("Player")
	var start_x = player.position.x
	Input.action_press("move_right")
	await frames(12)
	Input.action_release("move_right")
	var moved = player.position.x - start_x
	check(abs(moved - float(args[3]) * 12.0 / 60.0) < 1, "packaged movement rule")
	await frames(190)
	check(game.score >= 1 and get_tree().get_nodes_in_group("mobs").size() >= 2, "actual exported round runs")
	check(player.visible, "player survives controlled pre-contact round")
	for node in get_tree().get_nodes_in_group("mobs"):
		node.queue_free()
	await frames(2)
	var mob = game.mob_scene.instantiate()
	mob.position = game.get_node("Player").position
	mob.freeze = true
	game.add_child(mob)
	await frames(6)
	check(not game.get_node("Player").visible, "exported physics triggers death")
	await frames(190)
	check(game.get_node("HUD/StartButton").visible, "game over returns menu")
	game.get_node("HUD/StartButton").pressed.emit()
	await frames(3)
	check(game.get_node("Player").visible and game.score == 0, "exported restart")
	game.get_node("Music").stop()
	game.get_node("DeathSound").stop()
	OS.delay_msec(100)
	print("DELIVERY_RESULT title=%s version=%s debug=%s moved=%.3f failed=%s" % [title, ProjectSettings.get_setting("application/config/version", ""), OS.has_feature("debug"), moved, failed])
	get_tree().quit.call_deferred(1 if failed else 0)
