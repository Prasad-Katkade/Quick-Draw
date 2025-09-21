import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";

export const TOOLS = [
  {
    name: "eraser",
    icon: <FontAwesomeIcon icon={faEraser} className="text-gray-500" />,
    showDrawer: true,
    subTools: [
      {
        name: "Erase",
        icon: <FontAwesomeIcon icon={faEraser} className="text-gray-500" />,
      },
      {
        name: "Clear all",
        icon: <FontAwesomeIcon icon={faTrash} className="text-gray-500" />,
      },
    ],
  },
  {
    name: "pen",
    icon: <span>P</span>,
    showDrawer: true,
    subTools: [
      { name: "thin", icon: "T" },
      { name: "thick", icon: "K" },
    ],
  },
  {
    name: "marker",
    icon: <span>M</span>,
    showDrawer: false,
  },
];
