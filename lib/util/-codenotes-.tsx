'use client'
import { Col, Row } from "react-bootstrap";

export default function CodeNotes(props){

    return <Row>
        <Col xs={12}>
            <h4>Containers</h4>
            <p></p>
            <code>
                <table>
                    <th>
                        Container types
                    </th>
                    <tr>
                        <td>{'( )'}</td>
                        <td>basic,</td>
                        <td>parameter,</td>
                        <td>priority</td>
                    </tr>
                    <tr>
                        <td>{'[ ]'}</td>
                        <td>array,</td>
                        <td>matrix,</td>
                        <td>latice</td>
                    </tr>
                    <tr>
                        <td>{'{ }'}</td>
                        <td>object,</td>
                        <td>function</td>
                    </tr>
                    <tr>
                        <td>{'< >'}</td>
                        <td>element,</td>
                        <td>type</td>
                    </tr>
                </table>
            </code> <br/><h4>Containers</h4>
            <p>these 2 lines say the same thing</p>
            <code>
                {'function f(...args){ }'}<br/>
                {'const f = (...args)=>{ }'}<br/>
            </code> <br/>
            <p>{"instruction name (arguments) {method}"}</p>
        </Col>
    </Row>
}