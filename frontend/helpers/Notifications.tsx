import React, { useState, useEffect } from "react";
import {
	Container,
	Row, 
	Col,
	Modal,
	Button,
	Form,
	Alert,
	InputGroup,
	FormControl,
	Toast
} from "react-bootstrap";
import { createContainer } from "unstated-next"
import { map, isEmpty } from "lodash";


export const useNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [dialog, setDialog] = useState(null);
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	const showLoadingOverlay = () => setLoadingOverlay(true);
	const hideLoadingOverlay = () => setLoadingOverlay(false);

	const showErrorNotification = (title, message) => {
		setNotifications([{
			'title': title,
			'message': message,
			'type': 'error'
		}]);
	}

	const showInfoNotification = (title, message) => {
		setNotifications([{
			'title': title,
			'message': message,
			'type': 'info'
		}]);
	}

	const showInfoDialog = (title, message) => {
		setDialog({
			'title': title,
			'message': message,
			'type': 'info'
		})
	}

	const showErrorDialog = (title, message) => {
		setDialog({
			'title': title,
			'message': message,
			'type': 'error'
		})
	}

	const confirmDialog = (title, message, onSuccess) => {
		setDialog({
			'title': title,
			'message': message,
			'type': 'confirm',
			'onSuccess': onSuccess
		})
	}

	const showFormDialog = (title, formRender) => {
		setDialog({
			'title': title,
			'formRender': formRender,
			'type': 'form'
		})
	}

	return {
		notifications,
		setNotifications,
		showInfoNotification,
		showErrorNotification,
		dialog,
		setDialog,
		showInfoDialog,
		showErrorDialog,
		showFormDialog,
		confirmDialog,
		loadingOverlay,
		setLoadingOverlay,
		showLoadingOverlay,
		hideLoadingOverlay
	} 
};

export const NotificationsContainer = createContainer(useNotifications);

export const Notifications = () => {
	const notifications = NotificationsContainer.useContainer();
	const [show, setShow] = useState(false);
	const hideNotification = () => { setShow(false); notifications.setNotifications([]); };
	const [showDialog, setShowDialog] = useState(false);
	const hideDialog = () => { setShowDialog(false); notifications.setDialog(null); };
	const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

	useEffect(() => {
		if(!isEmpty(notifications.notifications)){
			setShow(true);
			setTimeout(() => { hideNotification() }, 5000);
		}
		if(!isEmpty(notifications.dialog)){
			setShowDialog(true);
		}
		if(notifications.loadingOverlay){
			setShowLoadingOverlay(true)
		} else {
			setShowLoadingOverlay(false);
		}
	}, [notifications]);

	return (
		<>
		<div id="toast-stack">
		{ map(notifications.notifications, notification => (
		<Toast key={notification.message} 
			show={show} onClose={hideNotification} 
			className={ notification.type == 'error' ? "bg-gradient-danger": "bg-gradient-info"}
		>
			<Toast.Header>
				<strong className="mr-auto">{notification.title}</strong>
			</Toast.Header>
			<Toast.Body>{notification.message}</Toast.Body>
		</Toast>
		))}
		</div>

		{ showLoadingOverlay && (
		<div id="loading-overlay">
			<div className="spinner-alt">
			  <div className="dot1"></div>
			  <div className="dot2"></div>
			</div>
		</div>
		)}
		{notifications.dialog && (
			<Modal centered className={ notifications.dialog.type == 'error' ? "modal-danger" : notifications.dialog.type == 'info' && "modal-info"} show={showDialog} onHide={hideDialog}>
				{notifications.dialog.title && (
				<Modal.Header closeButton>
					<Modal.Title className="pl-2">{notifications.dialog.title}</Modal.Title>
				</Modal.Header>
				)}
				{ notifications.dialog.type == 'form' ? (
				<>
					{notifications.dialog.formRender(hideDialog)}
				</>
				) : (
				<>
				<Modal.Body>
					<p className="lead m-0 pl-2 pr-2">{notifications.dialog.message}</p>
				</Modal.Body>
				<Modal.Footer>
					{notifications.dialog.type == 'confirm' ? (
					<>
					<Button variant="primary" onClick={ () => { notifications.dialog.onSuccess(); hideDialog()} }>
						Confirm
					</Button>
					<Button variant="secondary" onClick={hideDialog}>
						Cancel
					</Button>
					</>
					) : (
					<Button variant="secondary" className="btn-white" onClick={hideDialog}>
						OK
					</Button>
					)}
				</Modal.Footer>
				</>
				)}
			</Modal>
		)}
		</>
	);
};