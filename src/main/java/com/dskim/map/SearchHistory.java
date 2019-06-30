package com.dskim.map;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class SearchHistory {
	private @Id @GeneratedValue Long id;
	private String keyWord;

	private @ManyToOne UserAccount userAccount;

	private SearchHistory() {}

	public SearchHistory(String keyWord, UserAccount userAccount) {
		this.keyWord = keyWord;
		this.userAccount = userAccount;
	}
}
