/* global CMS, createClass, h */

(function () {
	if (!window.CMS || !window.createClass || !window.h) return;

	function formatDate(value) {
		if (!value) return '';
		var d = new Date(value);
		if (Number.isNaN(d.valueOf())) return String(value);
		try {
			return new Intl.DateTimeFormat('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}).format(d);
		} catch (e) {
			return d.toISOString().slice(0, 10);
		}
	}

	function toArray(maybeList) {
		if (!maybeList) return [];
		if (Array.isArray(maybeList)) return maybeList;
		if (typeof maybeList.toJS === 'function') return maybeList.toJS();
		return [];
	}

	var PostPreview = window.createClass({
		render: function () {
			var entry = this.props.entry;
			var title = entry.getIn(['data', 'title']) || 'Untitled';
			var description = entry.getIn(['data', 'description']) || '';
			var pubDate = entry.getIn(['data', 'pubDate']);
			var tags = toArray(entry.getIn(['data', 'tags']));

			return window.h(
				'article',
				{ className: 'preview-article' },
				window.h(
					'div',
					{ className: 'preview-meta' },
					window.h('time', { className: 'muted' }, formatDate(pubDate)),
					tags && tags.length
						? window.h(
							'div',
							{ className: 'pill-row' },
							tags.slice(0, 8).map(function (t) {
								return window.h('span', { className: 'pill' }, String(t));
							}),
						)
						: null,
				),
				window.h('h1', null, title),
				description ? window.h('p', { className: 'lead' }, description) : null,
				this.props.widgetFor('body'),
			);
		},
	});

	window.CMS.registerPreviewTemplate('posts', PostPreview);
})();
