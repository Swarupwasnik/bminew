import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Welcome() {
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
  return /* @__PURE__ */ jsx("main", { className: "flex items-center justify-center pt-16 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center gap-16 min-h-0", children: [
    /* @__PURE__ */ jsx("header", { className: "flex flex-col items-center gap-9", children: /* @__PURE__ */ jsx("div", { className: "w-[500px] max-w-[100vw] p-4" }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-[400px] w-full space-y-6 px-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-white text-center", children: "BMI Calculator" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 text-center", children: "Enter your height and weight to calculate your Body Mass Index" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "height",
              className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
              children: "Height (cm)"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "height",
              type: "number",
              value: height,
              onChange: (e) => setHeight(e.target.value),
              onBlur: () => handleBlur("height"),
              className: `w-full px-4 py-3 border ${errors.height ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`,
              placeholder: "e.g. 175"
            }
          ),
          errors.height && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.height })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "weight",
              className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
              children: "Weight (kg)"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "weight",
              type: "number",
              value: weight,
              onChange: (e) => setWeight(e.target.value),
              onBlur: () => handleBlur("weight"),
              className: `w-full px-4 py-3 border ${errors.weight ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`,
              placeholder: "e.g. 70"
            }
          ),
          errors.weight && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.weight })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: calculateBMI,
              disabled: !!errors.height || !!errors.weight,
              className: `flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${!!errors.height || !!errors.weight ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`,
              children: "Calculate BMI"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: resetCalculator,
              className: "flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition duration-200 hover:shadow-md",
              children: "Reset"
            }
          )
        ] })
      ] }),
      bmi && /* @__PURE__ */ jsx("div", { className: "mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 shadow-inner", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-300", children: "Your BMI is" }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl font-extrabold text-blue-600 dark:text-blue-400", children: bmi }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `inline-block px-3 py-1 rounded-full ${category === "Underweight" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200" : category === "Normal weight" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : category === "Overweight" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"}`,
            children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: category })
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: [
          "BMI Range: Underweight (",
          "<",
          "18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)"
        ] })
      ] }) })
    ] }) })
  ] }) });
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Ks5PdKEw.js", "imports": ["/assets/chunk-GNGMS2XR-Dos2DHKy.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DQ3-Rmbb.js", "imports": ["/assets/chunk-GNGMS2XR-Dos2DHKy.js", "/assets/with-props-CmJzUyz8.js"], "css": ["/assets/root-B3TY2AOz.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-DVKpxtbM.js", "imports": ["/assets/with-props-CmJzUyz8.js", "/assets/chunk-GNGMS2XR-Dos2DHKy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-9dc9d368.js", "version": "9dc9d368" };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
