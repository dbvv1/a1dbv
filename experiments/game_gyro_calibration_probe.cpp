// Original offline synthetic driver; no device, engine, input injection or networking.
#include <cstdio>
#include "GamepadMotion.hpp"
using GamepadMotionHelpers::CalibrationMode;
constexpr float dt = 0.01f; // seconds, synthetic 100 Hz; NOT render delta
void sample(GamepadMotion& m, float y) {
    // Y-up. Specific force +Y at rest; library gravity tends to (0,-1,0).
    // Gyro is degrees/second. Rotation about Y leaves this accelerometer unchanged.
    m.ProcessMotion(0.f, y, 0.f, 0.f, 1.f, 0.f, dt);
}
void report(const char* mode, int n, float input, GamepadMotion& m) {
    float x,y,z,bx,by,bz,gx,gy,gz,pitch,yaw;
    m.GetCalibratedGyro(x,y,z); m.GetCalibrationOffset(bx,by,bz);
    m.GetGravity(gx,gy,gz); m.GetPlayerSpaceGyro(pitch,yaw);
    std::printf("%s,%.2f,%.6f,%.6f,%.6f,%.6f,%.6f\n", mode,n*dt,input,y,by,yaw,gy);
}
void constant_then_stop(const char* name, CalibrationMode mode) {
    GamepadMotion m; m.SetCalibrationMode(mode); // otherwise unmodified defaults
    for(int n=1;n<=1100;++n) {
        const float input = n<=1000 ? 0.2f : 0.f;
        sample(m,input);
        if(n==100 || n==200 || n==300 || n==500 || n==1000 || n==1001 || n==1100)
            report(name,n,input,m);
    }
}
int main() {
    std::puts("mode,time_s,input_y_dps,calibrated_y_dps,bias_y_dps,player_yaw_dps,gravity_y_g");
    constant_then_stop("Manual",CalibrationMode::Manual);
    constant_then_stop("Stillness",CalibrationMode::Stillness);
    constant_then_stop("Stillness+SensorFusion",CalibrationMode::Stillness|CalibrationMode::SensorFusion);
    // Separate case: externally declared stationary interval, known +0.1 dps bias.
    GamepadMotion calibrated;
    calibrated.SetCalibrationMode(CalibrationMode::Manual);
    calibrated.StartContinuousCalibration();
    for(int n=1;n<=200;++n) sample(calibrated,0.1f);
    calibrated.PauseContinuousCalibration();
    for(int n=201;n<=300;++n) sample(calibrated,0.1f);
    report("ManualKnownBias_stationary",300,0.1f,calibrated);
    for(int n=301;n<=400;++n) sample(calibrated,0.3f); // bias 0.1 + intended rotation 0.2
    report("ManualKnownBias_rotating",400,0.3f,calibrated);
}
