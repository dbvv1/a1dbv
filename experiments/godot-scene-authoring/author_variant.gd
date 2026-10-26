extends SceneTree

func _initialize():
	var original = load("res://main.tscn") as PackedScene
	if original == null:
		quit(1)
		return
	var scene = original.instantiate(PackedScene.GEN_EDIT_STATE_MAIN)
	var player = scene.get_node("Player")
	scene.set_editable_instance(player, true)
	player.speed = 240
	scene.get_node("MobTimer").wait_time = 0.25
	var shape = player.get_node("CollisionShape2D").shape.duplicate() as CapsuleShape2D
	shape.radius = 14.0
	shape.height = 40.0
	if ResourceSaver.save(shape, "res://variant_player_shape.tres") != OK:
		quit(2)
		return
	player.get_node("CollisionShape2D").shape = load("res://variant_player_shape.tres")
	var variant = PackedScene.new()
	if variant.pack(scene) != OK or ResourceSaver.save(variant, "res://variant.tscn") != OK:
		quit(3)
		return
	scene.free()
	print("AUTHOR_OK speed=240 spawn_interval=0.25 capsule_radius=14 capsule_height=40")
	quit(0)
