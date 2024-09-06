import postcss from "postcss";
import tailwindcss from "tailwindcss";

async function convertTailwindToCSS(tailwindClasses: string): Promise<string> {
  // Create the CSS with Tailwind directives and the classes to apply
  const inputCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

.temp-class {
  @apply ${tailwindClasses};
}`;

  // Create a minimal Tailwind config object
  const tailwindConfig = {
    content: [{ raw: inputCss }],
    theme: {
      extend: {},
    },
    plugins: [],
  };

  // Process the input CSS with Tailwind
  const result = await postcss([tailwindcss(tailwindConfig)]).process(
    inputCss,
    {
      from: undefined,
    }
  );

  // Extract the generated CSS
  const generatedCSS = result.css;

  console.log(generatedCSS); // This is where it spits out!!!!!

  // Extract the .temp-class styles including pseudo-classes
  const tempClassRegex = /\.temp-class[\s\S]*/;
  const match = generatedCSS.match(tempClassRegex);
  console.log("MATCH", match);

  if (match && match[0]) {
    return match[0].trim();
  } else {
    throw new Error("Failed to extract CSS properties");
  }
}

// Example usage
async function main() {
  try {
    const tailwindClasses =
      "bg-blue-500 text-white p-4 py-8 md:hover:bg-sky-700";
    const css = await convertTailwindToCSS(tailwindClasses);
    console.log("Generated CSS:", css);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
