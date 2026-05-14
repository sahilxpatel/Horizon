'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Collapse, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { useRouter } from "next/navigation";
import apiClient from "../../services/apiClient";

const defaultFilters = {
  city: "",
  keyword: "",
  minPrice: "",
  maxPrice: "",
  minGroupSize: "",
  maxGroupSize: "",
  minDistance: "",
  maxDistance: "",
  minRating: 0,
  featured: false,
  sortBy: "avgRating",
  order: "desc",
};

const AdvancedSearchBar = () => {
  const router = useRouter();
  const [filters, setFilters] = useState(defaultFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSampleTours = async () => {
      try {
        const { data } = await apiClient.get("/tours/search/advanced", {
          params: { limit: 50, order: "desc", sortBy: "avgRating" },
        });
        const uniqueCities = Array.from(
          new Set((data?.data || []).map((tour) => tour.city).filter(Boolean))
        ).slice(0, 12);
        setCities(uniqueCities);
      } catch (err) {
        console.error("Failed to preload search metadata", err);
      }
    };

    loadSampleTours();
  }, []);

  const handleInputChange = (field) => (event) => {
    const { value, type, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (field) => (event) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const cleanedParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === "" || value === null) {
        return;
      }
      if (typeof value === "number" && Number.isNaN(value)) {
        return;
      }
      if (key === "featured" && !value) {
        return;
      }
      params[key] = value;
    });
    return params;
  }, [filters]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const query = new URLSearchParams();
    Object.entries(cleanedParams).forEach(([key, value]) => {
      query.set(key, String(value));
    });

    const url = query.toString() ? `/tours/search?${query.toString()}` : "/tours/search";
    router.push(url);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setError(null);
  };

  return (
    <div className="advanced-search__wrapper shadow">
      <Form onSubmit={handleSubmit}>
        <Row className="g-3 align-items-end">
          <Col lg="3" md="6">
            <FormGroup>
              <Label for="city">Destination</Label>
              <Input
                id="city"
                placeholder="Search by city"
                list="cityOptions"
                value={filters.city}
                onChange={handleInputChange("city")}
              />
              <datalist id="cityOptions">
                {cities.map((city) => (
                  <option value={city} key={city} />
                ))}
              </datalist>
            </FormGroup>
          </Col>
          <Col lg="3" md="6">
            <FormGroup>
              <Label for="keyword">Experience</Label>
              <Input
                id="keyword"
                placeholder="Adventure, culture, beaches..."
                value={filters.keyword}
                onChange={handleInputChange("keyword")}
              />
            </FormGroup>
          </Col>
          <Col lg="2" md="4">
            <FormGroup>
              <Label for="minGroupSize">Guests</Label>
              <Input
                id="minGroupSize"
                type="number"
                min="1"
                placeholder="1"
                value={filters.minGroupSize}
                onChange={handleNumberChange("minGroupSize")}
              />
            </FormGroup>
          </Col>
          <Col lg="2" md="4">
            <FormGroup>
              <Label for="maxPrice">Budget (₹)</Label>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                placeholder="Any"
                value={filters.maxPrice}
                onChange={handleNumberChange("maxPrice")}
              />
            </FormGroup>
          </Col>
          <Col lg="2" md="4">
            <div className="advanced-search__actions">
              <Button
                color="primary"
                type="submit"
                className="w-100 mb-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Searching…" : "Search"}
              </Button>
              <Button color="link" type="button" onClick={() => setIsAdvancedOpen((prev) => !prev)}>
                {isAdvancedOpen ? "Hide filters" : "More filters"}
              </Button>
            </div>
          </Col>
        </Row>

        <Collapse isOpen={isAdvancedOpen} className="mt-3">
          <div className="advanced-search__collapse">
            <Row className="g-3">
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="minPrice">Min price (₹)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={handleNumberChange("minPrice")}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="maxDistance">Max distance (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    min="0"
                    placeholder="Any"
                    value={filters.maxDistance}
                    onChange={handleNumberChange("maxDistance")}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="maxGroupSize">Max group size</Label>
                  <Input
                    id="maxGroupSize"
                    type="number"
                    min="1"
                    placeholder="Any"
                    value={filters.maxGroupSize}
                    onChange={handleNumberChange("maxGroupSize")}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="minRating">Minimum rating</Label>
                  <Input
                    id="minRating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={handleNumberChange("minRating")}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="sortBy">Sort by</Label>
                  <Input
                    id="sortBy"
                    type="select"
                    value={filters.sortBy}
                    onChange={handleInputChange("sortBy")}
                  >
                    <option value="avgRating">Rating</option>
                    <option value="price">Price</option>
                    <option value="distance">Distance</option>
                    <option value="maxGroupSize">Group size</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="order">Sort order</Label>
                  <Input
                    id="order"
                    type="select"
                    value={filters.order}
                    onChange={handleInputChange("order")}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3" md="6" className="d-flex align-items-center">
                <FormGroup check>
                  <Input
                    id="featured"
                    type="checkbox"
                    checked={filters.featured}
                    onChange={handleInputChange("featured")}
                  />
                  <Label check htmlFor="featured" className="ms-2">
                    Only show featured tours
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="3" md="6" className="d-flex align-items-center justify-content-end">
                <Button color="secondary" outline type="button" onClick={handleReset}>
                  Reset filters
                </Button>
              </Col>
            </Row>
          </div>
        </Collapse>

        {error && (
          <Alert color="danger" className="mt-3 mb-0">
            {error}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default AdvancedSearchBar;

