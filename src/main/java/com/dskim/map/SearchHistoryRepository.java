package com.dskim.map;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface SearchHistoryRepository extends PagingAndSortingRepository<SearchHistory, Long>{

	@Override
	SearchHistory save(@Param("searchHistory") SearchHistory searchHistory);
}
