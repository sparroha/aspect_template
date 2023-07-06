import { Col, Container, Row } from "react-bootstrap"
import { User } from "../pages/login/[userlogin]"
import Head from "next/head"

export type ActiveUsers = {
    [key: string]: {
        user: User
        lastActive: number
    }
}
export type HeaderTags = {
    title?: string
    description?: string
    keywords?: string
    author?: string
    favicon?: string
}
export function TaggedHeaders(props: HeaderTags) {
    const { title, description, keywords, author, favicon } = props
    return <Head>
                <title>{title || 'Aspect Bridge'}</title>
                <meta name="author" content={author || 'Aspect Bridge'} />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="keywords" content={keywords || ""} />
                <meta name="description" content={description || ""} />
                <link rel="shortcut icon" href={`/assets/${favicon}`} type="image/x-icon" />
            </Head>
}
export type ColBuilder = {
    id: string
    label: string
    content: any
    style?: {}
    className?: string
}
export function BuildColumn(props: ColBuilder) {
    const { id, label, content, style, className } = props
    const _content = (typeof content === 'string' && content.includes('.png')) ? <img src={content} width={'200px'}/> : <>{content}</>
    return <Col id={id} className={className} style={{...style}}>
        <h1>{label}</h1>
        {_content}
    </Col>
}
export type RowBuilder = {
    id: string
    cols: ColBuilder[]
    style?: {}
    className?: string
}
export function BuildRow(props: RowBuilder) {
    const { id, cols, style, className } = props
    return <Row id={id} className={className} style={{...style}}>
        {cols.map((col, i) => {
            return <BuildColumn key={i} {...col}/>
        })}
    </Row>
}
export type ContentBuilder = {
    id: string
    rows: RowBuilder[]
    style?: {}
    className?: string
}
export function BuildContents(props: ContentBuilder) {
    const { id, rows, style, className } = props
    return <div id={id} className={className} style={{...style}}>
        {rows.map((row, i) => {
            return <BuildRow key={i} {...row}/>
        })}
    </div>
}
export type PageBuilder = {
    id: string
    headers: HeaderTags
    contents: ContentBuilder
}
export default function BuildPage(props: PageBuilder) {
    const { id, headers, contents } = props
    return <Container id={id}>
        <TaggedHeaders {...headers}/>
        <BuildContents {...contents}/>
    </Container>
}


/**
 * 
 * colomn builder
 * (content)
 * 
 * 
 * 
 * 
 */