import typesenseClient from "../../../utils/typesense/typesenseConfig"
export default class TypesenseService { 

  async search(keyword: string, page: number = 1){
    try {
      
      let q = ""
      if(keyword !== "" && keyword !== null ){
        q = keyword.split(" ").length > 1 ? `phrase:${keyword}` : keyword;
        // q = keyword.split(" ").join(" AND ");
      }
      const searchResult = await typesenseClient.collections('lessons').documents().search({
        page,
        q,
        per_page: 20,
        query_by: 'title',
        // filter_by: [],
        sort_by: 'rating:desc',
        include_fields: 'id,title,image_url,user_id,attendees,likes,played,resources_count,feedback_count'
      });
  
      return searchResult;
    } catch (error) {
      console.log(error);
      return { error: 'Error en la búsqueda' };
    }
    
  }
}