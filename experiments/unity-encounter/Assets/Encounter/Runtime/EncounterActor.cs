using UnityEngine;

namespace NativeEncounter
{
  // A narrow scene consumer: CharacterController owns position; clips only pose the model.
  [RequireComponent(typeof(CharacterController))]
  public sealed class EncounterActor : MonoBehaviour
  {
    public Animator animator;
    public bool player;
    public EncounterActor opponent;
    public float speed = 2.0f;
    public float attackSeconds = 1.1667f;
    public float hurtSeconds = 0.6f;
    public int health = 3;
    CharacterController motor;
    float remaining;
    float elapsed;
    bool committed;
    string state = "idle";
    Vector3 spawn;

    void Awake() { motor = GetComponent<CharacterController>(); spawn = transform.position; }
    void Update()
    {
      if (health <= 0) return;
      if (remaining > 0)
      {
        remaining -= Time.deltaTime;
        elapsed += Time.deltaTime;
        if (state == "attack" && !committed && elapsed >= 0.60f)
        {
          committed = true;
          // Hit at the authored contact phase, once. Collider overlap is actual Unity physics.
          foreach (var hit in Physics.OverlapSphere(transform.position + transform.forward * 0.85f + Vector3.up, 0.55f))
          {
            var target = hit.GetComponentInParent<EncounterActor>();
            if (target != null && target == opponent) { target.ReceiveHit(); break; }
          }
        }
        if (remaining > 0) return;
      }
      Vector2 axes = Vector2.zero;
      bool attack = false;
      if (player)
      {
#if ENABLE_INPUT_SYSTEM
        var keyboard = UnityEngine.InputSystem.Keyboard.current;
        if (keyboard != null)
        {
          axes.x = (keyboard.dKey.isPressed ? 1 : 0) - (keyboard.aKey.isPressed ? 1 : 0);
          axes.y = (keyboard.wKey.isPressed ? 1 : 0) - (keyboard.sKey.isPressed ? 1 : 0);
          attack = keyboard.spaceKey.wasPressedThisFrame;
        }
#else
        axes = new Vector2((Input.GetKey(KeyCode.D) ? 1 : 0) - (Input.GetKey(KeyCode.A) ? 1 : 0),
          (Input.GetKey(KeyCode.W) ? 1 : 0) - (Input.GetKey(KeyCode.S) ? 1 : 0));
        attack = Input.GetKeyDown(KeyCode.Space);
#endif
      }
      else if (opponent != null && opponent.health > 0)
      {
        var delta = opponent.transform.position - transform.position;
        if (delta.magnitude > 1.2f) axes = new Vector2(delta.x, delta.z).normalized;
        else
        {
          if (delta.sqrMagnitude > 0.001f) transform.forward = new Vector3(delta.x, 0, delta.z).normalized;
          attack = true;
        }
      }
      var movement = Vector3.ClampMagnitude(new Vector3(axes.x, 0, axes.y), 1);
      if (movement.sqrMagnitude > 0.01f) transform.forward = movement;
      motor.Move((movement * speed + Vector3.down * 2) * Time.deltaTime);
      if (attack) BeginAttack();
      else Pose(movement.sqrMagnitude > 0.01f ? "walk" : "idle");
    }
    public void BeginAttack()
    {
      if (health <= 0 || remaining > 0) return;
      elapsed = 0; committed = false; remaining = attackSeconds; state = "";
      Pose("attack");
    }
    public void ReceiveHit()
    {
      if (health <= 0) return;
      health--;
      remaining = health <= 0 ? 0 : hurtSeconds;
      elapsed = 0; committed = true; state = "";
      Pose(health <= 0 ? "death" : "hurt");
    }
    public void ResetEncounter()
    {
      motor.enabled = false; transform.position = spawn; motor.enabled = true;
      health = 3; remaining = 0; elapsed = 0; committed = false; state = "";
      animator.Rebind(); animator.Update(0); Pose("idle");
    }
    void Pose(string next)
    {
      if (state == next) return;
      state = next; animator.CrossFadeInFixedTime(next, 0.08f, 0, 0);
    }
    void OnGUI()
    {
      if (!player) return;
      GUI.Label(new Rect(15, 15, 650, 30), "WASD: move | Space: attack | Native Unity encounter (unverified scaffold)");
      GUI.Label(new Rect(15, 45, 400, 30), "Health: " + health + " / Enemy: " + (opponent != null ? opponent.health : 0));
      if (GUI.Button(new Rect(15, 80, 150, 35), "Restart encounter"))
      { ResetEncounter(); if (opponent != null) opponent.ResetEncounter(); }
    }
  }
}
