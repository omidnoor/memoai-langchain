import { ChakraProvider } from "@chakra-ui/react";
import Canvas from "components/CanvasUI/Canvas/Canvas";
import CardLibrary from "components/CanvasUI/Card/CardLibrary/CardLibrary";
import CardTemplate from "components/CanvasUI/Card/CardTemplate/CardTemplate";
import DropCards from "components/CanvasUI/Card/DropCards/DropCards";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const canvas = () => {
  return (
    <ChakraProvider>
      <DndProvider backend={HTML5Backend}>
        <Canvas>
          <CardLibrary>
            <CardTemplate color="#4fcfff" text="card-1" />
            <CardTemplate color="#4fff4d" text="card-2" />
          </CardLibrary>
          <DropCards />
        </Canvas>
      </DndProvider>
    </ChakraProvider>
  );
};
export default canvas;
