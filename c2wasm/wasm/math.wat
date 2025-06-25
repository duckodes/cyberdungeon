(module
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

  (export "truncateDecimal" (func $truncateDecimal))
)