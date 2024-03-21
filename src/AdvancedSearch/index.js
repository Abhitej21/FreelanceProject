import React,{useState} from 'react';
import EachLabel from '../EachLabel';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'


const labels = ['All of these words',
                'Any of these words',
                'None of these words',
                'The exact phrase',
                'Title search',
                'Title search'];

const AdvancedSearch = () => {
  



  const [showModal,setShowModal] = useState(false)
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
    <div>
       <p onClick={openModal} className="adv-search" style={{ cursor: 'pointer', color: 'green',fontWeight: 'bold' }}>
        Advanced Search
      </p>
      </div>
      <Modal show={showModal} size="lg" onHide={closeModal} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>Advanced Search</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {labels.map((each,idx) => <EachLabel key={idx} id={idx} label={each}/>)}
        </Modal.Body>
        <Modal.Footer>
          <Button className="but cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button className='but search' onClick={closeModal}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>
    {/* </div> */}

    
    </>
  );
};

export default AdvancedSearch;
