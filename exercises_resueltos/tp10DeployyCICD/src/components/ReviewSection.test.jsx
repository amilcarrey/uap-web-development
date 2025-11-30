import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewSection from './ReviewSection';

describe('Review System', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders review form and empty list initially', () => {
        render(<ReviewSection bookId="1" />);
        expect(screen.getByText('Write a Review')).toBeInTheDocument();
        expect(screen.getByText('No reviews yet. Be the first to write one!')).toBeInTheDocument();
    });

    it('allows adding a review', () => {
        render(<ReviewSection bookId="1" />);

        const nameInput = screen.getByPlaceholderText('Your name');
        const reviewInput = screen.getByPlaceholderText('Share your thoughts...');
        const submitBtn = screen.getByText('Submit Review');

        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(reviewInput, { target: { value: 'Great book!' } });
        fireEvent.click(submitBtn);

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Great book!')).toBeInTheDocument();
        expect(screen.queryByText('No reviews yet. Be the first to write one!')).not.toBeInTheDocument();
    });

    it('persists reviews in localStorage', () => {
        const { unmount } = render(<ReviewSection bookId="1" />);

        const nameInput = screen.getByPlaceholderText('Your name');
        const reviewInput = screen.getByPlaceholderText('Share your thoughts...');
        const submitBtn = screen.getByText('Submit Review');

        fireEvent.change(nameInput, { target: { value: 'Persistent User' } });
        fireEvent.change(reviewInput, { target: { value: 'Saved review' } });
        fireEvent.click(submitBtn);

        unmount();

        render(<ReviewSection bookId="1" />);
        expect(screen.getByText('Persistent User')).toBeInTheDocument();
        expect(screen.getByText('Saved review')).toBeInTheDocument();
    });

    it('allows voting on reviews', () => {
        render(<ReviewSection bookId="1" />);

        // Add a review first
        fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Voter' } });
        fireEvent.change(screen.getByPlaceholderText('Share your thoughts...'), { target: { value: 'Vote me' } });
        fireEvent.click(screen.getByText('Submit Review'));

        const upvoteBtn = screen.getByText('▲');
        const voteCount = screen.getByText('0');

        fireEvent.click(upvoteBtn);
        expect(voteCount).toHaveTextContent('1');

        const downvoteBtn = screen.getByText('▼');
        fireEvent.click(downvoteBtn);
        expect(voteCount).toHaveTextContent('0');
    });
});
