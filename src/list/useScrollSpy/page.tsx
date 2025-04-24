import React, { useState } from "react";
import { useScrollSpy } from "@supunlakmal/hooks";

function ScrollSpyExample() {
  const sections = ["section1", "section2", "section3"];
  const activeSection = useScrollSpy(sections.map((id) => document.getElementById(id)));

  return (
    <div>
      <h1>useScrollSpy Example</h1>
      <nav>
        {sections.map((id, index) => (
          <a
            key={id}
            href={`#${id}`}
            style={{ fontWeight: activeSection === index ? "bold" : "normal" }}
          >
            {id}
          </a>
        ))}
      </nav>
      <div style={{ height: "200vh" }}>
        {sections.map((id) => (
          <section id={id} key={id} style={{ height: "100vh" }}>
            {id}
          </section>
        ))}
      </div>
    </div>
  );
}

export default ScrollSpyExample;