import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { searchRoutes } from '../api';
import SearchForm from '../components/SearchForm';
import BusCard from '../components/BusCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import moment from 'moment';

const BusSearchPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  const location = useLocation();
  const searchDataFromState = location.state?.searchData;

  useEffect(() => {
    if (searchDataFromState) {
      handleSearch(searchDataFromState);
    }
  }, [searchDataFromState]);

  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      setError('');
      setSearchParams(searchData);
      setSearchPerformed(true);
      
      const { data } = await searchRoutes(searchData);
      setRoutes(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to search buses. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SearchForm onSearch={handleSearch} />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {searchPerformed && (
            <div className="mb-4">
              <h3>
                {searchParams && (
                  <>
                    {searchParams.source} to {searchParams.destination}
                    <span className="ms-2 text-muted fs-5">
                      {moment(searchParams.date).format('ddd, DD MMM YYYY')}
                    </span>
                  </>
                )}
              </h3>
              
              {routes.length === 0 ? (
                <Alert variant="info">
                  No buses found for this route on the selected date. Please try another date or route.
                </Alert>
              ) : (
                <p>{routes.length} buses found</p>
              )}
            </div>
          )}

          <Row>
            <Col>
              {routes.map((route) => (
                <BusCard key={route._id} route={route} />
              ))}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default BusSearchPage;