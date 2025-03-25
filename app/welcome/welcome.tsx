import { useState, useEffect } from "react";

export function Welcome() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({ height: "", weight: "" });
  const [touched, setTouched] = useState({ height: false, weight: false });

  useEffect(() => {
    if (touched.height) {
      validateHeight();
    }
    if (touched.weight) {
      validateWeight();
    }
  }, [height, weight, touched]);

  const validateHeight = () => {
    if (!height) {
      setErrors((prev) => ({ ...prev, height: "Please enter your height" }));
      return false;
    } else if (height <= 0) {
      setErrors((prev) => ({ ...prev, height: "Height must be positive" }));
      return false;
    } else if (height > 300) {
      setErrors((prev) => ({ ...prev, height: "Height seems too high" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, height: "" }));
    return true;
  };

  const validateWeight = () => {
    if (!weight) {
      setErrors((prev) => ({ ...prev, weight: "Please enter your weight" }));
      return false;
    } else if (weight <= 0) {
      setErrors((prev) => ({ ...prev, weight: "Weight must be positive" }));
      return false;
    } else if (weight > 600) {
      setErrors((prev) => ({ ...prev, weight: "Weight seems too high" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, weight: "" }));
    return true;
  };

  const calculateBMI = () => {
    const isHeightValid = validateHeight();
    const isWeightValid = validateWeight();

    if (!isHeightValid || !isWeightValid) {
      return;
    }

    const heightInMeters = height / 100;
    const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(
      1
    );
    setBmi(calculatedBmi);

    if (calculatedBmi < 18.5) {
      setCategory("Underweight");
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setCategory("Normal weight");
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      setCategory("Overweight");
    } else {
      setCategory("Obese");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
    setErrors({ height: "", weight: "" });
    setTouched({ height: false, weight: false });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4"></div>
        </header>
        <div className="max-w-[400px] w-full space-y-6 px-4">
          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
              BMI Calculator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Enter your height and weight to calculate your Body Mass Index
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  onBlur={() => handleBlur("height")}
                  className={`w-full px-4 py-3 border ${
                    errors.height
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                  placeholder="e.g. 175"
                />
                {errors.height && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.height}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  onBlur={() => handleBlur("weight")}
                  className={`w-full px-4 py-3 border ${
                    errors.weight
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                  placeholder="e.g. 70"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.weight}
                  </p>
                )}
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={calculateBMI}
                  disabled={!!errors.height || !!errors.weight}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${
                    !!errors.height || !!errors.weight
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-md"
                  }`}
                >
                  Calculate BMI
                </button>
                <button
                  onClick={resetCalculator}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition duration-200 hover:shadow-md"
                >
                  Reset
                </button>
              </div>
            </div>

            {bmi && (
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 shadow-inner">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Your BMI is
                  </p>
                  <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                    {bmi}
                  </p>
                  <div
                    className={`inline-block px-3 py-1 rounded-full ${
                      category === "Underweight"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                        : category === "Normal weight"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        : category === "Overweight"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                    }`}
                  >
                    <p className="text-sm font-semibold">{category}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    BMI Range: Underweight ({"<"}18.5) | Normal (18.5-24.9) |
                    Overweight (25-29.9) | Obese (≥30)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
