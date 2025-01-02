import { Box, Flex, Image, Text } from "@chakra-ui/react";
import MorphingSVG from "./components/MorphingSvg";
import BirdsSvg from "./assets/birds.svg";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import Footer from "./components/Footer";

export default function App() {
  const controls = useAnimationControls();
  const outerControls = useAnimationControls();

  useEffect(() => {
    controls.start({ rotate: 120 });
    outerControls.start({ y: 100 });
    setTimeout(() => {
      outerControls.start({ y: 0 });
    }, 200);
  }, []);
  return (
    <Flex
      width={"100%"}
      justifyContent={"start"}
      alignItems={"center"}
      bg={"#000"}
      color={"#fff"}
      flexDirection={"column"}
    >
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        color={"#000"}
        width={"100%"}
        bg={"#fff"}
        gap={7}
        padding={4}
      >
        <motion.div
          animate={controls}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <img width={100} height={100} src={BirdsSvg} />
        </motion.div>

        <Image src="src/assets/web.png" width={'700px'} height={'32px'} />
      </Flex>
      <MorphingSVG />
      <Footer />
    </Flex>
  );
}
