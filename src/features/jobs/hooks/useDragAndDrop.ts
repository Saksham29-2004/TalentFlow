

import { useRef } from 'react';

/**
 * A generic hook to handle drag-and-drop reordering logic for any list.
 * @param list The current list of items.
 * @param onReorder A callback function that receives the newly reordered list.
 */
export const useDragAndDrop = <T,>(
  list: T[],
  onReorder: (reorderedList: T[]) => void
) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null)  ;

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    
    e.preventDefault();
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const newList = [...list];
    const draggedItemContent = newList.splice(dragItem.current, 1)[0];
    newList.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    
    onReorder(newList);
  };


  return {
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
  };
};