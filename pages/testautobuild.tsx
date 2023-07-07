import BuildPage, { BuildContents, BuildRow, ColBuilder, ContentBuilder, RowBuilder } from '../components/page_builder'
export default function Auto(props){
    return <BuildPage id={'auto'} headers={{title: 'Auto Build'}} contents={
        {
            id: 'auto-contents',
            rows: [
                {
                    id: 'auto-row',
                    cols: [
                        {
                            id: 'auto-col',
                            content: 'Auto Build / Hellow World'
                        }
                    ]
                }
            ]
        }
    }/>
}