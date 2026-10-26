extends SceneTree

var failures: Array[String] = []
var spawned = 0

func check(condition: bool, detail: String):
	if not condition:
		failures.append(detail)
		printerr("CHECK_FAILED: " + detail)

func frames(count: int):
	for i in count:
		await process_frame

func _initialize():
	run.call_deferred()

func run():
	seed(1234)
	var args = OS.get_cmdline_user_args()
	if args.size() != 4:
		printerr("Expected scene, speed, interval, radius")
		quit(2)
		return
	var packed = load(args[0]) as PackedScene
	if packed == null:
		quit(3)
		return
	var game = packed.instantiate()
	root.add_child(game)
	current_scene = game
	await frames(2)
	var player = game.get_node("Player")
	var hud = game.get_node("HUD")
	var mob_timer = game.get_node("MobTimer")
	check(is_equal_approx(player.speed, float(args[1])), "reopened speed")
	check(is_equal_approx(mob_timer.wait_time, float(args[2])), "reopened spawn interval")
	var shape = player.get_node("CollisionShape2D").shape
	if shape == null:
		printerr("CHECK_FAILED: missing collision shape")
		game.queue_free()
		quit.call_deferred(4)
		return
	check(is_equal_approx(shape.radius, float(args[3])), "reopened shape radius")
	check(is_equal_approx(shape.height, 68 if float(args[3]) == 27 else 40), "reopened shape height")
	check(not player.visible, "initial title hides player")
	for animation in player.get_node("AnimatedSprite2D").sprite_frames.get_animation_names():
		var sprite_frames = player.get_node("AnimatedSprite2D").sprite_frames
		for frame in sprite_frames.get_frame_count(animation):
			check(sprite_frames.get_frame_texture(animation, frame) != null, "imported player texture")
	check(game.get_node("Music").stream != null, "imported music stream")
	check(game.get_node("DeathSound").stream != null, "imported death stream")
	check(hud.get_node("ScoreLabel").get("theme_override_fonts/font") != null, "imported HUD font")
	game.child_entered_tree.connect(func(node):
		if node.is_in_group("mobs"):
			spawned += 1)
	hud.get_node("StartButton").pressed.emit()
	await frames(2)
	check(player.visible and game.score == 0, "official HUD signal starts round")
	var start_x = player.position.x
	Input.action_press("move_right")
	await frames(12)
	Input.action_release("move_right")
	var moved = player.position.x - start_x
	check(abs(moved - float(args[1]) * 12.0 / 60.0) < 1.0, "native Input movement: " + str(moved))
	await frames(190)
	check(game.score >= 1, "native ScoreTimer increments score")
	var timer_spawned = spawned
	check(timer_spawned == (2 if float(args[2]) == 0.5 else 5), "native MobTimer instances official mob scene")
	# Isolate the next native physics contact from previously spawned random mobs.
	clear_previous_mobs()
	await frames(2)
	var mob = game.mob_scene.instantiate()
	mob.position = player.position + Vector2(72, 0)
	mob.freeze = true
	game.add_child(mob)
	await frames(6)
	var edge_hit = not player.visible
	check(edge_hit == (float(args[3]) > 20), "changed collision resource affects edge contact")
	if not edge_hit:
		mob.position = player.position
		await frames(6)
	check(not player.visible, "native Area2D body contact emits hit")
	check(mob_timer.is_stopped() and game.get_node("ScoreTimer").is_stopped(), "hit stops round timers")
	await frames(190)
	check(hud.get_node("StartButton").visible, "official game-over coroutine returns start button")
	hud.get_node("StartButton").pressed.emit()
	await frames(3)
	check(player.visible and game.score == 0, "second round restores player and score")
	check(get_nodes_in_group("mobs").is_empty(), "second round frees prior mobs")
	print("CONSUMER_RESULT scene=%s moved=%.3f timer_spawned=%d edge_hit=%s failures=%d" % [args[0], moved, timer_spawned, edge_hit, failures.size()])
	game.get_node("Music").stop()
	game.get_node("DeathSound").stop()
	# Dummy audio mixer runs on wall time even with accelerated fixed frames.
	OS.delay_msec(100)
	game.queue_free()
	await frames(2)
	quit.call_deferred(0 if failures.is_empty() else 1)

func clear_previous_mobs():
	for node in get_nodes_in_group("mobs"):
		node.queue_free()
