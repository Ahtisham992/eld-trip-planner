import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TripForm from './TripForm';

describe('TripForm Component', () => {
  it('renders the form correctly', () => {
    render(<TripForm onSubmit={() => {}} loading={false} />);
    
    // Check if the title is present
    expect(screen.getByText('Plan New Trip')).toBeDefined();
    
    // Check if inputs are rendered
    expect(screen.getByLabelText(/Current Location/i)).toBeDefined();
    expect(screen.getByLabelText(/Pickup Location/i)).toBeDefined();
    expect(screen.getByLabelText(/Dropoff Location/i)).toBeDefined();
    
    // Check submit button
    expect(screen.getByRole('button', { name: /Generate Route & Logs/i })).toBeDefined();
  });

  it('handles user input correctly', () => {
    render(<TripForm onSubmit={() => {}} loading={false} />);
    
    const currentLocInput = screen.getByLabelText(/Current Location/i);
    fireEvent.change(currentLocInput, { target: { value: 'New York, NY' } });
    
    expect(currentLocInput.value).toBe('New York, NY');
  });

  it('calls onSubmit with form data when submitted', () => {
    const handleSubmit = vi.fn();
    render(<TripForm onSubmit={handleSubmit} loading={false} />);
    
    const submitButton = screen.getByRole('button', { name: /Generate Route & Logs/i });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      current_location: 'Los Angeles, CA',
      pickup_location: 'San Francisco, CA',
      dropoff_location: 'Portland, OR',
      current_cycle_used: 0
    });
  });

  it('disables button when loading', () => {
    render(<TripForm onSubmit={() => {}} loading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /Calculating.../i });
    expect(submitButton.disabled).toBe(true);
  });
});
