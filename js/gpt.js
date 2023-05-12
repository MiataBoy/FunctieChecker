const functionNames = " The name of the function must describe exactly what the function does, and must start with a verb. Additionally, the entire function must be comprised in ONE language and be snake_case."
const parameterNames = " Parameter names must describe exactly what the parameter is for, must be comprised of ONE language and must be snake_case."
const returnValues = " The return value should remain useful to the user under any circumstance."
const localVars = " Used variables must only be local, and must be comprised of ONE language, global variables must only be used as a last resort and only if there is no other way around it."
const oneJob = " The function must be dedicated to a single task, and must not serve multiple."
const reusable = " The function must be reusable under any circumstance where it could be usable."
const printInstruction = " The function must not contain any print instructions, unless the function is dedicated to printing something."
const inputInstruction = " The function must not contain any input instructions, unless the function is dedicated to receiving, and/or submitting inputs."
const unrecoverableErrors = " The function must not contain error raises-, exits or prints"

async function fetchCompletions(text, defaultContent) {
    const url = "https://free.churchless.tech/v1/chat/completions";
    const adata = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": defaultContent,
            },
            {
                "role": "user",
                "content": text,
            },
        ],
        "max_tokens": 500,
    };
    const headers = {
        "Content-Type": "application/json",
    };

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(adata),
            });

            if (response.status === 500) {
                retries++;
                console.warn(`Retry ${retries}/${maxRetries}: Server error (500)`);
            } else {
                const data = await response.json();
                console.info(data);
                const content = data.choices[0].message.content;
                return content;
            }
        } catch (error) {
            console.error("Error:", error);
            return `Error: ${error}`;
        }
    }

    return "Error: Maximum retries reached. Server is still returning a 500 error.";
}

function handleButtonClick() {
    const textInput = document.getElementById("textInput");
    const text = textInput.value;

    const defaultContent = "Only accept inquiries with functions in code, otherwise return \"i cannot assist you with anything besides code functions\". The function must pass the following requirements:"

    fetchCompletions(text).then((content) => {
        const output = document.getElementById("output");
        output.value = content;
        autoResize(document.getElementById('output'));
    });

}

function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on the content
}