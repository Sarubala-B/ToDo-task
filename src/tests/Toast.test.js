import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Toast from '../components/Toast';

describe('Toast Component', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
    });

    test('renders toast message with the correct type class', () => {
        render(<Toast message="Test message" type="success" onClose={() => {}} />);
    
        const toastElement = screen.getByText(/Test message/i);
        expect(toastElement).toBeInTheDocument();
        expect(toastElement).toHaveClass('toast');
        expect(toastElement).toHaveClass('toast-success');
    });

    test('renders toast with default success class if type is unknown', () => {
        render(<Toast message="Test message" type="unknown" onClose={() => {}} />);
    
        const toastElement = screen.getByText(/Test message/i);
        expect(toastElement).toBeInTheDocument();
        expect(toastElement).toHaveClass('toast');
        expect(toastElement).toHaveClass('toast-success');
    });

    test('does not render toast if no message is provided', () => {
        render(<Toast message="" type="success" onClose={() => {}} />);    
        const toastElement = screen.queryByText(/Test message/i);
        expect(toastElement).not.toBeInTheDocument();
    });

    test('calls onClose after 3000 milliseconds', () => {
        jest.useFakeTimers();
        const mockOnClose = jest.fn();
        render(<Toast message="Test message" type="success" onClose={mockOnClose} />);   
        act(() => {
            jest.advanceTimersByTime(3000);
        });    
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
