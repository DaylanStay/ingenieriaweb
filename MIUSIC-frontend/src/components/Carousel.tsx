import React, { useState, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';
import '../theme/Carousel.css';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function Carousel<T>({ items, renderItem }: CarouselProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 4 : 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="carousel">
      <div className="carousel-content">
        {visibleItems.map((item, index) => (
          <div key={index} className="carousel-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="carousel-controls">
          <IonButton fill="clear" onClick={prevPage}>
            <IonIcon icon={chevronBack} />
          </IonButton>
          <span>{`${currentPage + 1} / ${totalPages}`}</span>
          <IonButton fill="clear" onClick={nextPage}>
            <IonIcon icon={chevronForward} />
          </IonButton>
        </div>
      )}
    </div>
  );
}

export default Carousel;