import React, { ReactNode, useEffect, useState } from "react"

type AutoProceedProps = {
    duration?: number
    children?: ReactNode
    onFinish?: Function
}


export const AutoProceed = ({duration = 1000, children, onFinish = () => {}}: AutoProceedProps) => {

    const childrenArray = React.Children.toArray(children).map((child) => {
        if (child != ",") {
            return child
        }
    });
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let counter = 1;
        const interval = setInterval(() => {
            if (counter == childrenArray.length) {
                clearInterval(interval);
                onFinish()
            } else {
                setCurrentIndex(counter);
                counter++;
            }
        }, duration)

        return () => clearInterval(interval);
    }, [])

    return (
        <div>
            {childrenArray.map((child, index) => {
                if (currentIndex == index) {
                    return (child)
                }
            })}
        </div>
    )

}