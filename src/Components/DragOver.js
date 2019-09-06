import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-use-gesture';
import { useSpring, interpolate, animated, config } from 'react-spring'
import { add, scale, dist, sub } from 'vec-la';
import burstImg from "./../assets/burst.gif";

const DragOver = () => {
    //const [xy, setXY] = useState([0, 0]);
    // const bind = useDrag(({ down, delta }) => { setXY(down ? delta : [0, 0]); });
    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));
    const [moonXY, setMoonXY] = useState([0, 0]);
    const [rocketXY, setRocketXY] = useState([0, 0]);
    const [{ pos }, setPos] = useSpring(() => ({ pos: [0, 0] }));
    const [{ angle }, setAngle] = useSpring(() => ({ angle: -1.57, config: config.wobbly }));
    let [rocketPreviousPos, setRocketPreviousPos] = useState([0, 0]);

    const bind = useDrag(({ xy, down, delta }) => {
        setMoonXY(xy);
        set({ xy: delta });
    });


    const bindRocket = useDrag(({ xy, initial, previous, down, delta, velocity, direction, memo = pos.getValue() }) => {
        setRocketPreviousPos(initial);
        setRocketXY(xy);
        setPos({ pos: add(delta, memo), immediate: down, config: { velocity: scale(direction, velocity), decay: true } })
        if (dist(xy, previous) > 10 || !down) {
            console.log(Math.atan2(direction[0], -direction[1]));
            setAngle({ angle: Math.atan2(direction[0], -direction[1]) });
        }
        return memo;
    })

    const isCrashed = () => {
        console.log("In");
        let rocketElement = document.getElementById('rocketID');
        if (rocketElement) {
            let rocketLocation = rocketElement.getBoundingClientRect();

            let moonElement = document.getElementById('moon');
            let moonLocation = moonElement.getBoundingClientRect();

            if ((rocketLocation.top >= moonLocation.top && rocketLocation.bottom <= moonLocation.bottom) && (rocketLocation.left >= moonLocation.left && rocketLocation.right <= moonLocation.right)) {
                console.log("crashed");
                const moonElement = document.getElementById('moon');
                moonElement.style.content = `url(${burstImg})`;
                const rocketElement = document.getElementById('rocketID');
                hideImage(rocketElement);
                setTimeout(() => {
                    hideImage(moonElement);
                }, 1000);
            }
        }

    }

    const hideImage = (element) => {
        element.style.content = 'url("")';
        element.style.width = 0;
        element.style.height = 0;
    }

    return <div>
        <div className="center-block">
            <animated.div id="moon" className="block"
                {...bind()}
                style={{
                    transform: xy.interpolate((x, y) => `translate3D(${x}px, ${y}px, 0)`)
                }}
            />

            <animated.div id="rocketID" className="rocket"
                {...bindRocket()}
                style={{ transform: interpolate([pos, angle], ([x, y], a) => { isCrashed(); return `translate3d(${x}px,${y}px,0) rotate(${a}rad)`; }) }}
            />
        </div>
    </div>
}

export default DragOver;