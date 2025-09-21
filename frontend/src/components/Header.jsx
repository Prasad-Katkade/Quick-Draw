import React from "react";
import {
    PlusCircleIcon,
    UserGroupIcon,
    ShareIcon,
} from "@heroicons/react/24/solid";
import { useRoomContext } from "../context/RoomContext";

export default function Header({

    setShowHeader,

}) {
    const { roomId, joinInput, setJoinInput, createRoom, joinRoom, exitRoom, userCount } = useRoomContext();
    return (
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center p-3">
            <div className="bg-white border border-gray-300 rounded-md shadow-lg p-4 w-full max-w-md">
                {!roomId ? (
                    <div className="flex flex-col gap-3">
                        {/* Create Room Button */}
                        <button
                            onClick={createRoom}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full"
                        >
                            <PlusCircleIcon className="w-5 h-5" />
                            Create Room
                        </button>

                        {/* Join Room Input + Button */}
                        <div className="flex gap-2">
                            <input
                                value={joinInput}
                                onChange={(e) => setJoinInput(e.target.value)}
                                placeholder="Enter room ID"
                                className="flex-1 px-3 py-2 rounded-md border border-gray-400 text-black text-sm"
                            />
                            <button
                                onClick={joinRoom}
                                className="px-4 py-2 rounded-md border border-gray-400 bg-gray-100 text-blue-600 font-semibold"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {/* Exit Room Button */}
                        <button
                            onClick={exitRoom}
                            className="px-4 py-3 rounded-md bg-rose-500 hover:bg-rose-600 text-white font-semibold w-full"
                        >
                            Exit Room - {roomId}
                        </button>

                        {/* Users joined + Share + Hide */}
                        <div className="flex items-center justify-between text-sm font-medium">
                            {/* Left: Users joined */}
                            <div className="flex items-center gap-2 text-gray-500">
                                <UserGroupIcon className="w-5 h-5 text-gray-400" />
                                {`${userCount} users joined`}
                            </div>

                            {/* Right: Share + Hide */}
                            <div className="flex items-center gap-3">
                                <ShareIcon className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
                                <button
                                    onClick={() => setShowHeader(false)}
                                    className="px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-600 font-semibold text-sm"
                                >
                                    Hide
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
