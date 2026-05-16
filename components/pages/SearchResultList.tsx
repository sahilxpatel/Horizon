'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react'
import CommonSection from '../../shared/CommonSection'
import { Badge, Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap'
import { useRouter, useSearchParams } from 'next/navigation'
import TourCard from '../../shared/Tourcard'
import Newsletter from '../../shared/Newsletter'
import apiClient from '../../services/apiClient'
import calculateAvgRating from '../../utils/avgRating'
import { clearSavedSearches, getSavedSearches, removeSavedSearch, saveSearch } from '../../utils/savedSearches'
import { AuthContext } from '../../context/AuthContext'

const priceBuckets = [
  { id: 'all', label: 'Any price', predicate: () => true },
  { id: 'budget', label: 'Under ₹5k', predicate: (tour) => tour.price <= 5000 },
  { id: 'mid', label: '₹5k – ₹15k', predicate: (tour) => tour.price > 5000 && tour.price <= 15000 },
  { id: 'premium', label: 'Above ₹15k', predicate: (tour) => tour.price > 15000 },
];

const normalizeTours = (items = []) =>
  items.map((tour) => {
    if (typeof tour?.avgRating === 'number') {
      return tour;
    }
    const { avgRating, totalRating } = calculateAvgRating(tour?.reviews || []);
    return { ...tour, avgRating, totalRating };
  });

const SearchResultList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [tours, setTours] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [viewFilters, setViewFilters] = useState({
    keyword: '',
    priceBucket: 'all',
    minRating: Number(searchParams.get('minRating') || 0),
    featuredOnly: searchParams.get('featured') === 'true',
    sortBy: searchParams.get('sortBy') || 'avgRating',
    order: searchParams.get('order') || 'desc',
  });

  const [savedSearches, setSavedSearches] = useState(() => getSavedSearches());
  const [saveLabel, setSaveLabel] = useState('');
  const [savedError, setSavedError] = useState(null);

  const currentParams = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const canSaveSearch = Object.keys(currentParams).length > 0;

  const fetchFromQuery = React.useCallback(async () => {
    if (!searchParams.toString()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const { data } = await apiClient.get('/tours/search/advanced', { params });
      setTours(normalizeTours(data?.data || []));
      setMeta({
        count: data?.count || 0,
        queriedAt: new Date().toISOString(),
        source: 'query-string',
      });
      setViewFilters((prev) => ({
        ...prev,
        minRating: params.minRating ? Number(params.minRating) : prev.minRating,
        featuredOnly: params.featured === 'true' ? true : prev.featuredOnly,
        sortBy: params.sortBy || prev.sortBy,
        order: params.order || prev.order,
      }));
    } catch (err) {
      console.error('Failed to fetch tours', err);
      const message = err.response?.data?.message || err.message || 'Unable to fetch tours';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFromQuery();
  }, [fetchFromQuery]);

  useEffect(() => {
    const loadSaved = async () => {
      if (!user) {
        setSavedSearches(getSavedSearches());
        return;
      }

      try {
        const { data } = await apiClient.get('/searches');
        setSavedSearches(data?.data || []);
        setSavedError(null);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Unable to load saved searches';
        setSavedError(message);
      }
    };

    loadSaved();
  }, [user]);

  const handleSaveSearch = async () => {
    if (!canSaveSearch) return;

    if (!user) {
      const updated = saveSearch(currentParams, saveLabel.trim());
      setSavedSearches(updated);
      setSaveLabel('');
      return;
    }

    try {
      const payload = { label: saveLabel.trim(), params: currentParams };
      const { data } = await apiClient.post('/searches', payload);
      if (data?.data) {
        setSavedSearches((prev) => [data.data, ...prev]);
        setSaveLabel('');
        setSavedError(null);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to save search';
      setSavedError(message);
    }
  };

  const handleApplySaved = (params) => {
    const safeParams = params && typeof params === 'object' ? params : {};
    const query = new URLSearchParams(safeParams);
    router.push(`/tours/search?${query.toString()}`);
  };

  const handleRemoveSaved = async (id) => {
    if (!user) {
      setSavedSearches(removeSavedSearch(id));
      return;
    }

    try {
      await apiClient.delete(`/searches/${id}`);
      setSavedSearches((prev) => prev.filter((item) => item.id !== id));
      setSavedError(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to remove saved search';
      setSavedError(message);
    }
  };

  const handleClearSaved = async () => {
    if (!user) {
      setSavedSearches(clearSavedSearches());
      return;
    }

    try {
      await apiClient.delete('/searches');
      setSavedSearches([]);
      setSavedError(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to clear saved searches';
      setSavedError(message);
    }
  };

  const filteredTours = useMemo(() => {
    const bucket = priceBuckets.find((item) => item.id === viewFilters.priceBucket) || priceBuckets[0];
    const keyword = viewFilters.keyword.trim().toLowerCase();

    const filtered = tours.filter((tour) => {
      if (viewFilters.featuredOnly && !tour.featured) {
        return false;
      }
      if (viewFilters.minRating && (tour.avgRating || 0) < viewFilters.minRating) {
        return false;
      }
      if (keyword) {
        const haystack = `${tour.title} ${tour.desc} ${tour.city}`.toLowerCase();
        if (!haystack.includes(keyword)) {
          return false;
        }
      }
      return bucket.predicate(tour);
    });

    const sorted = [...filtered].sort((a, b) => {
      const direction = viewFilters.order === 'asc' ? 1 : -1;
      const key = viewFilters.sortBy;
      const valueA = a[key] ?? 0;
      const valueB = b[key] ?? 0;

      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });

    return sorted;
  }, [tours, viewFilters]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setViewFilters((prev) => ({
      ...prev,
      [field]: field === 'minRating' ? Number(value) : value,
    }));
  };

  const toggleFeatured = () => {
    setViewFilters((prev) => ({
      ...prev,
      featuredOnly: !prev.featuredOnly,
    }));
  };

  return (
    <>
      <CommonSection title={'Find your perfect tour'} />
      <section>
        <Container>
          <Row className="mb-4">
            <Col lg="12">
              <Card className="search-results__filters shadow-sm">
                <CardBody className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                  <div>
                    <h5 className="mb-1">{filteredTours.length} curated experiences</h5>
                    <p className="text-muted mb-0">
                      {loading
                        ? 'Fetching tours…'
                        : meta?.count
                        ? `Refined from ${meta.count} matches`
                        : tours.length
                        ? `Based on ${tours.length} results`
                        : 'Adjust filters to discover more journeys'}
                    </p>
                    {viewFilters.featuredOnly && (
                      <Badge color="warning" pill className="mt-2">
                        Featured only
                      </Badge>
                    )}
                  </div>
                  <div className="search-results__control-grid">
                    <div className="search-results__control">
                      <label htmlFor="keyword">Search within results</label>
                      <Input
                        id="keyword"
                        value={viewFilters.keyword}
                        onChange={handleInputChange('keyword')}
                        placeholder="Try island, safari, trek..."
                      />
                    </div>
                    <div className="search-results__control">
                      <label htmlFor="priceBucket">Budget</label>
                      <Input
                        id="priceBucket"
                        type="select"
                        value={viewFilters.priceBucket}
                        onChange={handleInputChange('priceBucket')}
                      >
                        {priceBuckets.map((bucket) => (
                          <option value={bucket.id} key={bucket.id}>
                            {bucket.label}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <div className="search-results__control">
                      <label htmlFor="minRating">Rating</label>
                      <Input
                        id="minRating"
                        type="select"
                        value={viewFilters.minRating}
                        onChange={handleInputChange('minRating')}
                      >
                        <option value={0}>Any</option>
                        <option value={3}>3★ & up</option>
                        <option value={4}>4★ & up</option>
                        <option value={4.5}>4.5★ & up</option>
                      </Input>
                    </div>
                    <div className="search-results__control">
                      <label htmlFor="sortBy">Sort</label>
                      <Input
                        id="sortBy"
                        type="select"
                        value={viewFilters.sortBy}
                        onChange={handleInputChange('sortBy')}
                      >
                        <option value="avgRating">Best rated</option>
                        <option value="price">Price</option>
                        <option value="distance">Distance</option>
                        <option value="maxGroupSize">Group size</option>
                      </Input>
                    </div>
                    <div className="search-results__control">
                      <label htmlFor="order">Order</label>
                      <Input
                        id="order"
                        type="select"
                        value={viewFilters.order}
                        onChange={handleInputChange('order')}
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </Input>
                    </div>
                    <button
                      type="button"
                      className={`search-results__toggle ${viewFilters.featuredOnly ? 'active' : ''}`}
                      onClick={toggleFeatured}
                    >
                      <i className="ri-star-smile-line"></i>
                      Featured
                    </button>
                  </div>
                </CardBody>
              </Card>

              <Card className="search-results__save shadow-sm mt-3">
                <CardBody className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div className="search-results__save__input">
                    <label htmlFor="saveSearch">Save this search</label>
                    <Input
                      id="saveSearch"
                      value={saveLabel}
                      onChange={(event) => setSaveLabel(event.target.value)}
                      placeholder="Name it (optional)"
                    />
                    {!user && (
                      <small className="text-muted">Saved locally on this device.</small>
                    )}
                  </div>
                  <Button color="primary" outline onClick={handleSaveSearch} disabled={!canSaveSearch}>
                    <i className="ri-bookmark-line"></i> Save search
                  </Button>
                </CardBody>
              </Card>

              {error && <p className="text-danger mt-2 mb-0">{error}</p>}
              {savedError && <p className="text-danger mt-2 mb-0">{savedError}</p>}

              {savedSearches.length > 0 && (
                <Card className="search-results__saved shadow-sm mt-3">
                  <CardBody>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <h6 className="mb-0">Saved searches</h6>
                      <Button color="link" className="p-0" onClick={handleClearSaved}>
                        Clear all
                      </Button>
                    </div>
                    <div className="search-results__saved__list mt-3">
                      {savedSearches.map((item) => (
                        <div className="search-results__saved__item" key={item.id}>
                          <button type="button" onClick={() => handleApplySaved(item.params)}>
                            <span>{item.label}</span>
                            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                          </button>
                          <Button
                            color="light"
                            size="sm"
                            className="search-results__saved__remove"
                            onClick={() => handleRemoveSaved(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
          <Row>
            {loading && <h4 className="text-center">Loading tours…</h4>}
            {!loading && filteredTours.length === 0 && (
              <Col lg="12">
                <div className="search-results__empty text-center py-5">
                  <h4 className="mb-2">No tours match your filters yet</h4>
                  <p className="text-muted mb-0">Try widening your budget or choosing a different destination.</p>
                </div>
              </Col>
            )}
            {!loading &&
              filteredTours.map((tour) => (
                <Col lg="3" md="4" sm="6" className="mb-4" key={tour.id || tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  )
}

export default SearchResultList

