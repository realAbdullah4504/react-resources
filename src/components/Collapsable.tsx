import { useState } from 'react';

const accordionItems = [
  {
    id: 1,
    title: 'Accordion 1',
    content: 'This is the content for Accordion 1.',
  },
  {
    id: 2,
    title: 'Accordion 2',
    content: 'This is the content for Accordion 2.',
  },
  {
    id: 3,
    title: 'Accordion 3',
    content: 'This is the content for Accordion 3.',
  },
];

export default function Accordion() {
  const [expandedId, setExpandedId] = useState(1);

  const toggleAccordion = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="accordion">
      {accordionItems.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className="accordion-item">
            <button
              id={`accordion-header-${item.id}`}
              className="accordion-header"
              aria-expanded={isExpanded}
              aria-controls={`accordion-panel-${item.id}`}
              onClick={() => toggleAccordion(item.id)}
              style={{
                border: '1px solid #000',
                borderRadius: '4px',
              }}
            >
              {item.title}
            </button>

            {isExpanded && (
              <div
                id={`accordion-panel-${item.id}`}
                className="accordion-content"
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}