import React, { useState, useEffect } from 'react';
import { Button, Offcanvas, Form, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { FaUserFriends, FaUserPlus, FaCheck, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { 
  getFriends, 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriend, 
  toggleFriendSharing 
} from '../services/emailApi';
import '../styles/FriendsButton.css';

const FriendsButton = () => {
  // State for button and side panel
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'add'
  
  // States for data
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [newFriendName, setNewFriendName] = useState('');
  
  // States for error handling and loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Close side panel
  const handleClose = () => setShow(false);
  
  // Open side panel
  const handleShow = () => {
    setShow(true);
    loadFriendsData();
  };
  
  // Load friends data
  const loadFriendsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getFriends();
      setFriends(data.friends || []);
      setPendingRequests(data.pending_requests || []);
    } catch (err) {
      setError("Unable to load friends data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Send friend request
  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    if (!newFriendEmail) {
      setError("Please enter an email address");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await sendFriendRequest(newFriendEmail, newFriendName || null);
      setSuccess("Request sent successfully");
      setNewFriendEmail('');
      setNewFriendName('');
      // Reload data
      await loadFriendsData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error sending request");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Accept friend request
  const handleAcceptRequest = async (email, name) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await acceptFriendRequest(email, name);
      setSuccess("Request accepted");
      // Reload data
      await loadFriendsData();
    } catch (err) {
      setError("Error accepting request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reject friend request
  const handleRejectRequest = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await rejectFriendRequest(email);
      setSuccess("Request rejected");
      // Reload data
      await loadFriendsData();
    } catch (err) {
      setError("Error rejecting request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Remove friend
  const handleRemoveFriend = async (email) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await removeFriend(email);
      setSuccess("Friend removed successfully");
      // Reload data
      await loadFriendsData();
    } catch (err) {
      setError("Error removing friend");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Enable/disable sharing with a friend
  const handleToggleSharing = async (email, currentStatus) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await toggleFriendSharing(email, !currentStatus);
      setSuccess(`Sharing ${!currentStatus ? 'enabled' : 'disabled'}`);
      // Reload data
      await loadFriendsData();
    } catch (err) {
      setError("Error changing sharing status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Change tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  };
  
  // Clear messages after delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  
  return (
    <>
      {/* Sticky button */}
      <Button 
        className="friends-button"
        onClick={handleShow}
        variant="dark"
      >
        <FaUserFriends size={24} />
        {pendingRequests.length > 0 && (
          <Badge pill bg="danger" className="friends-badge">
            {pendingRequests.length}
          </Badge>
        )}
      </Button>
      
      {/* Side panel */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Friends Management</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Navigation between tabs */}
          <div className="friends-tabs">
            <Button 
              variant={activeTab === 'friends' ? 'primary' : 'outline-primary'} 
              onClick={() => handleTabChange('friends')}
              className="me-2"
            >
              My Friends
              {friends.length > 0 && <Badge bg="secondary" className="ms-2">{friends.length}</Badge>}
            </Button>
            <Button 
              variant={activeTab === 'requests' ? 'primary' : 'outline-primary'} 
              onClick={() => handleTabChange('requests')}
              className="me-2"
              disabled={pendingRequests.length === 0}
            >
              Requests
              {pendingRequests.length > 0 && <Badge bg="danger" className="ms-2">{pendingRequests.length}</Badge>}
            </Button>
            <Button 
              variant={activeTab === 'add' ? 'primary' : 'outline-primary'} 
              onClick={() => handleTabChange('add')}
            >
              Add
            </Button>
          </div>
          
          {/* Error and success messages */}
          {error && <div className="text-danger mt-3">{error}</div>}
          {success && <div className="text-success mt-3">{success}</div>}
          
          {/* Loading indicator */}
          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          
          {/* Tab content */}
          <div className="friends-content mt-4">
            {/* My friends tab */}
            {activeTab === 'friends' && (
              <div>
                <h5>Your Friends</h5>
                {friends.length === 0 ? (
                  <p>You don't have any friends yet.</p>
                ) : (
                  <ListGroup>
                    {friends.map((friend) => (
                      <ListGroup.Item key={friend.email} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{friend.name || friend.email}</strong>
                          <div className="text-muted">{friend.email}</div>
                        </div>
                        <div>
                          <Button
                            variant="link"
                            onClick={() => handleToggleSharing(friend.email, friend.sharing_enabled)}
                            disabled={loading}
                            className="me-2"
                            title={friend.sharing_enabled ? "Disable sharing" : "Enable sharing"}
                          >
                            {friend.sharing_enabled ? <FaToggleOn className="text-success" size={20} /> : <FaToggleOff className="text-muted" size={20} />}
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => handleRemoveFriend(friend.email)}
                            disabled={loading}
                            className="text-danger"
                            title="Remove"
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            )}
            
            {/* Requests tab */}
            {activeTab === 'requests' && (
              <div>
                <h5>Pending Requests</h5>
                {pendingRequests.length === 0 ? (
                  <p>No pending requests.</p>
                ) : (
                  <ListGroup>
                    {pendingRequests.map((request) => (
                      <ListGroup.Item key={request.email} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{request.name || request.email}</strong>
                          <div className="text-muted">{request.email}</div>
                        </div>
                        <div>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAcceptRequest(request.email, request.name)}
                            disabled={loading}
                            className="me-2"
                          >
                            <FaCheck /> Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRejectRequest(request.email)}
                            disabled={loading}
                          >
                            <FaTimes /> Reject
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            )}
            
            {/* Add tab */}
            {activeTab === 'add' && (
              <div>
                <h5>Add a Friend</h5>
                <Form onSubmit={handleSendRequest}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={newFriendEmail}
                      onChange={(e) => setNewFriendEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newFriendName}
                      onChange={(e) => setNewFriendName(e.target.value)}
                      placeholder="Friend's name"
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading || !newFriendEmail}
                  >
                    <FaUserPlus className="me-2" /> Send Request
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FriendsButton; 