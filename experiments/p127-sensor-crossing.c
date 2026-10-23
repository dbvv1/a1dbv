/* Original driver for the unmodified upstream Box2D C library. No renderer. */
#include <box2d/box2d.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#ifndef P127_MINOR
#error Define P127_MINOR as 1 or 2 to match the linked upstream library.
#endif
#if P127_MINOR != 1 && P127_MINOR != 2
#error Unsupported Box2D minor version.
#endif

static int run_case(const char *name, bool sensor, float speed) {
  b2WorldDef wd = b2DefaultWorldDef();
  wd.gravity = (b2Vec2){0.0f, 0.0f};
  b2WorldId world = b2CreateWorld(&wd);
  b2BodyDef bd = b2DefaultBodyDef();
  b2BodyId gate = b2CreateBody(world, &bd);
  b2ShapeDef sd = b2DefaultShapeDef();
  sd.isSensor = sensor;
  sd.enableSensorEvents = sensor;
  sd.enableContactEvents = !sensor;
  b2Polygon box = b2MakeBox(0.05f, 1.0f);
  b2ShapeId gate_shape = b2CreatePolygonShape(gate, &sd, &box);

  bd.type = b2_dynamicBody;
  bd.position = (b2Vec2){-0.2f, 0.0f};
  bd.linearVelocity = (b2Vec2){speed, 0.0f};
  bd.isBullet = false;
  b2BodyId visitor = b2CreateBody(world, &bd);
  sd.isSensor = false;
  b2Circle circle = {.center = {0.0f, 0.0f}, .radius = 0.05f};
  b2CreateCircleShape(visitor, &sd, &circle);
  const float dt = 1.0f / 60.0f;
  fprintf(stderr, "%s: continuous=%d cap=%.1f speed=%.1f bullet=%d dt=%.9f substeps=1\n",
          name, wd.enableContinuous, wd.maximumLinearSpeed, speed, bd.isBullet, dt);
  int begins = 0, ends = 0, contacts = 0, bad = 0;
  if (!wd.enableContinuous || wd.maximumLinearSpeed != 400.0f) bad = 1;
  float first_x = 0.0f;
  for (int step = 0; step <= 12; ++step) {
    if (step) b2World_Step(world, dt, 1);
    b2Vec2 p = b2Body_GetPosition(visitor);
    b2SensorEvents se = b2World_GetSensorEvents(world);
    b2ContactEvents ce = b2World_GetContactEvents(world);
    int current = 0;
    if (sensor) {
      b2ShapeId ids[4];
#if P127_MINOR == 1
      current = b2Shape_GetSensorOverlaps(gate_shape, ids, 4);
#else
      current = b2Shape_GetSensorData(gate_shape, ids, 4);
#endif
    }
    /* Geometry check is only an observation; never feeds physics/events. */
    int geometric_overlap = fabsf(p.x) < 0.1f;
    printf("%s,%d,%.6f,%.6f,%d,%d,%d,%d,%d\n", name, step,
           step * dt, p.x, geometric_overlap, current,
           se.beginCount, se.endCount, ce.beginCount);
    begins += se.beginCount;
    ends += se.endCount;
    contacts += ce.beginCount;
    if (step == 1) first_x = p.x;
    if (!isfinite(p.x) || p.y != 0.0f) bad = 1;
    if (sensor && speed == 24.0f) {
      int expected_begin = P127_MINOR == 2 && step == 1;
      int expected_end = P127_MINOR == 2 && step == 2;
      if (geometric_overlap || current != expected_begin ||
          se.beginCount != expected_begin || se.endCount != expected_end) bad = 1;
    }
  }
  if (sensor && speed == 24.0f) {
    if (first_x < 0.19f || first_x > 0.21f) bad = 1;
    if (P127_MINOR == 1 ? (begins != 0 || ends != 0)
                        : (begins != 1 || ends != 1)) bad = 1;
  } else if (sensor) {
    if (begins != 1 || ends != 1) bad = 1;
  } else if (first_x >= 0.0f || contacts == 0) {
    bad = 1;
  }
  b2DestroyWorld(world);
  return bad;
}

int main(int argc, char **argv) {
  (void)argv;
  if (argc != 1) { fputs("No arguments accepted.\n", stderr); return 2; }
  b2Version v = b2GetVersion();
  if (v.major != 3 || v.minor != P127_MINOR ||
      v.revision != (P127_MINOR == 1 ? 1 : 0)) {
    fputs("Header/build selection does not match linked library.\n", stderr);
    return 2;
  }
  printf("case,step,time_s,x_m,geometric_overlap,sensor_data,begin,end,contact_begin\n");
  int failed = run_case("fast_sensor", true, 24.0f);
  failed |= run_case("slow_sensor", true, 3.0f);
  failed |= run_case("fast_solid", false, 24.0f);
  fprintf(stderr, "Box2D %d.%d.%d: %s\n", v.major, v.minor, v.revision,
          failed ? "FAIL" : "PASS");
  return failed ? 1 : 0;
}
