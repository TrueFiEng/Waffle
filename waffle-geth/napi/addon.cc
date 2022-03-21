#include <napi.h>
#include "../go/build/wafflegeth.h"

Napi::Value Add(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  double arg0 = info[0].As<Napi::Number>().DoubleValue();
  double arg1 = info[1].As<Napi::Number>().DoubleValue();
  Napi::Number num = Napi::Number::New(env, arg0 + arg1);

  return num;
}

Napi::Value bindCgoCurrentMillis(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Number num = Napi::Number::New(env, cgoCurrentMillis());
  return num;
}

Napi::Value bindCountLines(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string arg = (std::string)info[0].As<Napi::String>().ToString();

  int32_t res = countLines((char*)arg.c_str());

  Napi::Number num = Napi::Number::New(env, res);
  return num;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "add"), Napi::Function::New(env, Add));
  exports.Set(Napi::String::New(env, "cgoCurrentMillis"), Napi::Function::New(env, bindCgoCurrentMillis));
  exports.Set(Napi::String::New(env, "countLines"), Napi::Function::New(env, bindCountLines));
  return exports;
}

NODE_API_MODULE(addon, Init)
