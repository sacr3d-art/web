import {
  Button,
  Flex,
  HStack,
  Text,
  Image,
  Wrap,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { animated, useSpring, useTrail } from "react-spring";
import { sections, svgPaths } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const MorphingSVG: React.FC = () => {
  const [startColor, setStartColor] = useState(`red`);
  const [endColor, setEndColor] = useState("red");
  const [imageGradientStartColor, setImageGradientStartColor] = useState("");
  const [imageGradientEndColor, setImageGradientEndColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(
    0
  );

  const [isMenuVisible, setIsMenuVisible] = useState(true); // Manage menu visibility
  const lastScrollY = useRef(0); // Track last scroll position

  const { isOpen, onOpen, onClose } = useDisclosure();

  const sectionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topMenuRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (index: number) => {
    const menuHeight = topMenuRef.current?.offsetHeight || 0;
    const section = sectionsRefs.current[index];
    if (section) {
      const top = section.offsetTop - menuHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const startHue = useTransform(scrollYProgress, [0, 1], [0, 990]);
  const endHue = useTransform(scrollYProgress, [0, 1], [80, 540]);

  const gradientStartColor = useTransform(
    startHue,
    (hue) => `hsl(${hue}, 100%, 50%)`
  );
  const gradientEndColor = useTransform(
    endHue,
    (hue) => `hsl(${hue}, 100%, 50%)`
  );

  function convertHSLToHSLA(hslString: string, alpha: number) {
    return hslString.replace(/^hsl\(([^)]+)\)$/, `hsla($1, ${alpha})`);
  }

  useEffect(() => {
    const unsubscribeStart = scrollYProgress.onChange((value) => {
      const hue = value * 990; // Map to 0-990
      setStartColor(`hsl(${hue}, 100%, 50%)`);
      setImageGradientStartColor(
        convertHSLToHSLA(`hsl(${hue}, 100%, 50%)`, 0.1)
      );
    });

    const unsubscribeEnd = scrollYProgress.onChange((value) => {
      const hue = value * 540; // Map to 0-540
      setEndColor(`hsl(${hue}, 100%, 50%)`);
      setImageGradientEndColor(convertHSLToHSLA(`hsl(${hue}, 100%, 50%)`, 0.3));
    });

    return () => {
      unsubscribeStart();
      unsubscribeEnd();
    };
  }, [scrollYProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsMenuVisible(
        currentScrollY < lastScrollY.current || currentScrollY === 0
      );
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openModal = (sectionIndex: number, imageIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentImageIndex(imageIndex);
    onOpen();
  };

  const handleNext = () => {
    if (currentSectionIndex !== null && currentImageIndex !== null) {
      const nextIndex =
        (currentImageIndex + 1) % sections[currentSectionIndex].images.length;
      setCurrentImageIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex !== null && currentImageIndex !== null) {
      const prevIndex =
        (currentImageIndex - 1 + sections[currentSectionIndex].images.length) %
        sections[currentSectionIndex].images.length;
      setCurrentImageIndex(prevIndex);
    }
  };

  return (
    <>
      <Flex direction="column" align="center" width="100%">
        {/* Top Menu */}
        <Wrap
          ref={topMenuRef}
          position="sticky"
          top={isMenuVisible ? "0" : "-170px"} // Hide menu when scrolling up
          transition="top 0.3s ease-in-out"
          bg={"white"}
          zIndex={100}
          padding={4}
          boxShadow="sm"
          width="100%"
          justify="center"
          spacing={2}
        >
          {sections.map((section, index) => (
            <Button
              key={index}
              onClick={() => scrollToSection(index)}
              variant="ghost"
              fontSize={{ base: "sm", md: "md" }}
              paddingX={{ base: 2, md: 4 }}
              _hover={{
                background: `linear-gradient(to right, ${endColor}, ${startColor});`,
              }}
            >
              {section.title}
            </Button>
          ))}
        </Wrap>

        {/* Sections */}
        {sections.map((section, index) => {
          const isLeftAligned = index % 2 === 0;

          const { ref, inView } = useInView({
            threshold: 0.3,
            triggerOnce: false,
          });

          const svgAnimation = useSpring({
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : !isLeftAligned
              ? `translateX(100%)`
              : `translateX(-100%)`,
          });

          const titleAnimation = useSpring({
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : isLeftAligned
              ? `translateX(100%)`
              : `translateX(-100%)`,
            width: "100%",
          });

          const descriptionAnimation = useSpring({
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : isLeftAligned
              ? `translateX(100%)`
              : `translateX(-100%)`,
            delay: 200,
          });

          const imageTrail = useTrail(section.images.length, {
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : !isLeftAligned
              ? "translateX(-150px)"
              : "translateX(150px)",
            config: { tension: 300, friction: 60 },
            delay: 400,
          });

          return (
            <Flex
              key={index}
              ref={(el) => {
                ref(el);
                sectionsRefs.current[index] = el;
              }}
              direction={{
                base: "column",
                md: isLeftAligned ? "row" : "row-reverse",
              }}
              align="center"
              justify="center"
              width="100%"
              marginY={8}
              padding={4}
              maxWidth="1200px"
              overflowX="hidden"
            >
              {/* SVG Animation */}
              <animated.div
                style={{
                  ...svgAnimation,
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  left: "30px",
                  bottom: "10px",
                }}
              >
                <svg width="325" height="325" viewBox="0 0 175 175">
                  <defs>
                    <linearGradient id={`gradient-${index}`}>
                      <motion.stop
                        offset="0%"
                        style={{ stopColor: gradientStartColor }}
                      />
                      <motion.stop
                        offset="100%"
                        style={{ stopColor: gradientEndColor }}
                      />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={svgPaths[index]}
                    fill={`url(#gradient-${index})`}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
              </animated.div>

              {/* Text and Description */}
              <Flex
                direction="column"
                flex={1}
                align={{ base: "center", md: "flex-start" }}
                textAlign={{ base: "center", md: "left" }}
                paddingX={4}
              >
                <animated.div style={titleAnimation}>
                  <Text
                    fontSize={{ md: "5xl", base: "4xl" }}
                    fontWeight="bold"
                    background={`linear-gradient(270deg, ${endColor}, ${startColor})`}
                    backgroundClip={"text"}
                    textAlign={{
                      base: "center",
                      md: isLeftAligned ? "right" : "left",
                    }}
                  >
                    {section.title}
                  </Text>
                </animated.div>
                <animated.div style={descriptionAnimation}>
                  <Text
                    fontFamily={"Montserrat"}
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight={600}
                    lineHeight={1.5}
                    marginTop={2}
                    textAlign={{ md: isLeftAligned ? "right" : "left" }}
                  >
                    {section.description}
                  </Text>
                </animated.div>
                <Flex
                  marginTop={4}
                  gap={8}
                  width={"100%"}
                  justifyContent={isLeftAligned ? "flex-end" : "flex-start"}
                >
                  {imageTrail.map((style, imgIndex) => (
                    <animated.div key={imgIndex} style={style}>
                      <Box
                        onClick={() => openModal(index, imgIndex)}
                        cursor="pointer"
                        overflow="hidden"
                        borderRadius="md"
                        width="{md: 150px}"
                        height="300px"
                        position="relative"
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${imageGradientStartColor}, ${imageGradientEndColor});`,

                          zIndex: 1,
                          transition: "background 0.3s ease", // Smooth transition for background
                        }}
                        _hover={{
                          transform: "scale(1.05)", // Scale on hover
                          _before: {
                            transition: "background 0.3s ease",
                            background: "none", // Remove the tint on hover
                          },
                          transition:
                            "transform 0.3s ease, background 0.3s ease", // Smooth transition for scaling and tint removal
                        }}
                      >
                        <Image
                          src={section.images[imgIndex].url}
                          alt={`Image ${imgIndex + 1}`}
                          width="150px"
                          height="100%"
                          objectFit="cover"
                          position="relative"
                          zIndex={0}
                        />
                      </Box>
                    </animated.div>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          );
        })}
      </Flex>

      {/* <Flex flexDirection={"column"}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          background={`linear-gradient(to right, ${endColor}, ${startColor});`}
          backgroundClip={"text"}
          textAlign={"center"}
        >
          Let's get in touch
        </Text>
        <Link href="mailto:info@sacr3d.art">info@sacr3d.art</Link>
        <Link href="tel:+36205254654">+3620525464</Link>
      </Flex> */}

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        motionPreset="slideInBottom"
        isCentered
        allowPinchZoom
        blockScrollOnMount={false}
      >
        <ModalOverlay backdropFilter="auto" backdropBlur={"4px"} />
        <ModalContent color="white" bg={"#000"}>
          <ModalHeader>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              background={`linear-gradient(to right, ${endColor}, ${startColor});`}
              backgroundClip={"text"}
              textAlign={"center"}
            >
              {sections[currentSectionIndex!].images[currentImageIndex].title}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} align="center">
              {currentImageIndex !== null && currentSectionIndex !== null && (
                <>
                  <Image
                    src={
                      sections[currentSectionIndex].images[currentImageIndex]
                        .url
                    }
                    alt="Selected"
                    borderRadius="md"
                    height={"600px"}
                    objectFit={"contain"}
                  />
                  <Flex
                    mt={4}
                    gap={4}
                    justifyContent="space-between"
                    width="100%"
                    alignItems={"center"}
                  >
                    <Text
                      mt={4}
                      textAlign={"center"}
                      fontFamily={"Montserrat"}
                      fontSize={"2xl"}
                      lineHeight={1}
                    >
                      {
                        sections[currentSectionIndex].images[currentImageIndex]
                          .description
                      }
                    </Text>
                  </Flex>
                  <Flex
                    position={"relative"}
                    bottom={"400px"}
                    width={"100%"}
                    justifyContent={"space-between"}
                  >
                    <Button onClick={handlePrevious}>
                      <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                    </Button>

                    <Button onClick={handleNext}>
                      <FontAwesomeIcon icon={faChevronRight} size="lg" />
                    </Button>
                  </Flex>
                </>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MorphingSVG;
