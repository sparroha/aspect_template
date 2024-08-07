'use client'
import Link from 'next/link';
import React from 'react'
import { Col, Row, SSRProvider } from 'react-bootstrap';
import useDomainRoot from '../components/domain';
export default function Main(props) {
    useDomainRoot(props)//redirects to the appropriate page
    return <Row>
        <Col sm={12}>Redirecting...{JSON.stringify(props)}</Col>
        <Col sm={12}><Link href="/home" legacyBehavior><a>Home</a></Link></Col>
    </Row>
}