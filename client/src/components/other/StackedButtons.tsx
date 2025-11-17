import { motion } from 'framer-motion';

const MyButtons = ({ isStacked }) => {
    const buttons = ["Google", "Facebook", "Twitter", "Github"];

    return (
        <div className="flex flex-col relative">
            {buttons.map((label, i) => (
                <motion.button
                    key={label}
                    className="min-w-[250px] bg-white border rounded-xl h-[46px] 
                     hover:bg-black hover:text-white text-black w-full mb-3"

                    /* STACK → UNSTACK animation */
                    animate={{
                        y: isStacked ? 0 : i * 55,  // stack on top then spread out
                    }}

                    /* REVERSE animation when unstacking */
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 16,
                        delay: isStacked ? i * 0.05 : (buttons.length - i) * 0.05,
                    }}
                >
                    {label}
                </motion.button>
            ))}
        </div>
    );
};


function StackedButtons(props: { isStacked: boolean }) {
    return (
        <>
            {<MyButtons isStacked={props.isStacked} />}
        </>
    )
}

export default StackedButtons
