(module
  (import "env" "Math_random" (func $random (result f64)))
  (import "env" "Math_pow" (func $pow (param f64 f64) (result f64)))
  (import "env" "Math_floor" (func $floor (param f64) (result f64)))

  (func $truncateDecimal (param $num f64) (param $digits i32) (result f64)
    (local $factor f64)
    ;; factor = pow(10.0, digits)
    (local.set $factor
      (call $pow
        (f64.const 10)
        (f64.convert_i32_s (local.get $digits))
      )
    )
    ;; return floor(num * factor) / factor
    (f64.div
      (call $floor
        (f64.mul (local.get $num) (local.get $factor))
      )
      (local.get $factor)
    )
  )

  (func $getRandomInt (param $min i32) (param $max i32) (result i32)
    call $random
    local.get $max
    local.get $min
    i32.sub
    f64.convert_i32_s
    f64.mul
    local.get $min
    f64.convert_i32_s
    f64.add
    i32.trunc_f64_s
  )

  (func $getRandomIntIncludeMax (param $min i32) (param $max i32) (result i32)
    call $random
    local.get $max
    local.get $min
    i32.sub
    i32.const 1
    i32.add
    f64.convert_i32_s
    f64.mul
    local.get $min
    f64.convert_i32_s
    f64.add
    i32.trunc_f64_s
  )

  (func $getRandomFloat (param $min f32) (param $max f32) (result f32)
    call $random
    f32.demote_f64
    local.get $max
    local.get $min
    f32.sub
    f32.mul
    local.get $min
    f32.add
  )

  (func $getRandomBool (result i32)
    call $random
    f64.const 0.5
    f64.lt
  )

  (export "truncateDecimal" (func $truncateDecimal))
  (export "getRandomInt" (func $getRandomInt))
  (export "getRandomIntIncludeMax" (func $getRandomIntIncludeMax))
  (export "getRandomFloat" (func $getRandomFloat))
  (export "getRandomBool" (func $getRandomBool))
)