import React from "react";
import useTranslation  from "../../hooks/useTranslation";

function TranslationExample() {
    const { t, setLanguage } = useTranslation({
        en: { greeting: "Hello" },
        es: { greeting: "Hola" },
    });

    return (
        <div>
            <h1>useTranslation Example</h1>
            <p>{t("greeting")}</p>
            <button onClick={() => setLanguage("en")}>English</button>
            <button onClick={() => setLanguage("es")}>Spanish</button>
        </div>
    );
}

export default TranslationExample;