import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, TextInput, StyleSheet, View } from 'react-native';
import StarRating from 'react-native-star-rating';

const RatingModal = ({ isVisible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRating = (rating) => {
        setRating(rating);
    };

    const handleCommentChange = (text) => {
        setComment(text);
    };

    const handleSubmit = () => {
        console.log('Rating:', rating);
        console.log('Comment:', comment);

        onClose();

        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>How was your experience?</Text>
                <View style={styles.starContainer}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={rating}
                        selectedStar={handleRating}
                        fullStarColor={'orange'}
                        emptyStarColor={'lightgrey'} 
                        starSize={30}
                        starStyle={{ marginRight: 8 }}
                    />
                </View>

                <TextInput
                    placeholder="Write your review.."
                    multiline={true}
                    numberOfLines={4}
                    style={styles.commentInput}
                    value={comment}
                    onChangeText={handleCommentChange}
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        color: 'white', 
        fontWeight: '600'
    },
    starContainer: {
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
        padding: 15,
        borderRadius: 13,
        width: '65%',
        height: 100,
        backgroundColor: 'white', 
        color: 'black', 
    },
    submitButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 13,
        width: '65%',
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'white',
    },
});

export default RatingModal;
