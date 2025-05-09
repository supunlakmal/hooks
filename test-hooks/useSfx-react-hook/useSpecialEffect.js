/*
    More granular useEffet() hook replacement
    Author: www.rafaelgandi.com
*/
import React from "react";

export default function useSfx(
    callback,
    // Passing false here means the effect will only run once. Like passing [] to useEffect() but in more stable way
    updatables = {}
) {
    const prevRef = React.useRef({});
    const renderCountRef = React.useRef(0);
    const excecutedRef = React.useRef(false); // See: https://youtu.be/HPoC-k7Rxwo?t=1287

    prevRef.current.update = (propertyString, value) => {
        if (!(propertyString in prevRef.current)) {
            prevRef.current[propertyString] = null;
        }
        prevRef.current[propertyString] = value;
    };

    prevRef.current.hasChanged = (...args) => {
        const hasAnythingChanged = args.map(check => {
            if (check instanceof Array) {
                return !Object.is(check[0], check[1]);
            } else {
                for (let p in check) {
                    if (!(p in prevRef.current)) {
                        if (renderCountRef.current > 1) {
                            throw new Error(
                                `useSfx() -> Looks like you are missing updatable "${p}". Please remove it from .hasChanged() or add it to the updatables object. For example: useSfx(..., {${p}, ...})`
                            );
                        }
                        return true;
                    }
                    return !Object.is(prevRef.current[p], check[p]);
                }
                return false;
            }
        });
        let i = 0;
        while (i < hasAnythingChanged.length) {
            if (hasAnythingChanged[i]) {
                return true;
            }
            i++;
        }
        return false;
    };

    React.useEffect(() => {
        // console.log(callback.toString());
        if (updatables === false) {
            // If user only wants to run this effect once.
            // See: https://youtu.be/HPoC-k7Rxwo?t=1287
            if (excecutedRef.current) {
                return;
            }
        }
        const cleanUp = callback(prevRef.current);
        for (let p in updatables) {
            prevRef.current.update(p, updatables[p]);
        }
        renderCountRef.current++;
        excecutedRef.current = true;
        return cleanUp;
    });
}
