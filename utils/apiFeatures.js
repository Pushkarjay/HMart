class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
      this.filterFields = [];
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // Advanced filtering with operators
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    search(searchFields = []) {
      if (this.queryString.search && searchFields.length > 0) {
        const searchRegex = new RegExp(this.queryString.search, 'i');
        const searchQuery = {
          $or: searchFields.map(field => ({
            [field]: { $regex: searchRegex }
          }))
        };
  
        this.query = this.query.find(searchQuery);
      }
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      
      this.pagination = {
        currentPage: page,
        limit,
        skip
      };
  
      return this;
    }
  
    async execute() {
      // Execute the query
      const results = await this.query;
  
      // Get total count for pagination
      const total = await this.query.model.countDocuments(this.query._conditions);
  
      return {
        results,
        pagination: {
          ...this.pagination,
          total,
          totalPages: Math.ceil(total / this.pagination.limit)
        }
      };
    }
  }
  
  module.exports = ApiFeatures;