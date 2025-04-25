import React, { useRef, useEffect } from "react";
import useScrollSpy  from "../../hooks/useScrollSpy";

function ScrollSpyExample() {
    const sections = ["section1", "section2", "section3"];
    const sectionRefs = sections.map(() => useRef<HTMLElement | null>(null));

    useEffect(() => {
        console.log(sectionRefs);
    }, []);

    const activeSection = useScrollSpy(sectionRefs);

    
    return (
        <div>

            <h1>useScrollSpy Example</h1>
            <nav>
                {sections.map((id, index) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        style={{ fontWeight: activeSection === id ? "bold" : "normal" }}
                        onClick={() => sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" })}
                    >
                        {id}
                    </a>
                ))}
            </nav>
            <div style={{ height: "200vh" }}>
                {sections.map((id, index) => (
                    <section ref={sectionRefs[index]} id={id} key={id} style={{ height: "100vh" }}>
                        <h1>{id}</h1>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default ScrollSpyExample;