# Product Review — TODO

## Completed

- [x] `product-review-list.tsx` — ProductReviewList, ProductReviewListView, ProductReviewListContent, ProductReviewListEmptyView
- [x] `product-review-list-item.tsx` — ProductReviewListItem, ProductReviewListItemStars, ProductReviewListItemAuthor, ProductReviewListItemDate, ProductReviewListItemComment
- [x] `product-review-list-item-media.tsx` — ProductReviewListItemMedia, ProductReviewListItemMediaView, ProductReviewListItemMediaContent, ProductReviewListItemMediaEmptyView, ProductReviewListItemMediaItem
- [x] `index.ts` — Barrel exports
- [x] `lib/query-keys.ts` — `reviewKeys`
- [x] Re-exported from `components/ui/product/index.ts`
- [x] `STRUCTURE.md` — Architecture docs + usage examples

## Pending

### Review Form (create/edit reviews)

```
product-review-form.tsx
  ReviewFormContext (rating, title, content, media[]) + MutationProvider
  Auto-infers productId from useProduct()

product-review-form-stars.tsx
  Interactive RatingGroup (no readOnly), writes to form context

product-review-form-title.tsx
  Optional TextField, writes to form context

product-review-form-comment.tsx
  Textarea, writes to form context

product-review-form-media.tsx
  File selection/preview via components/ui/file-field
  Converts FileField files to ReviewMediaInput[]
  Upload via R2 endpoint: POST /api/v1/uploads/presigned → POST /api/v1/uploads/register

product-review-form-submit.tsx
  MutationButton wrapper, disabled when form invalid

product-review-form-error.tsx
  MutationErrorMessage for backend validation errors
  (e.g. "You must purchase this product", "Already reviewed")
```

### Backend Integration

- [ ] `POST /api/v1/uploads/presigned` — Get presigned S3 URL per file
- [ ] `POST /api/v1/uploads/register` — Register uploaded file metadata
- [ ] Pass resulting URLs to `reviewsApi.create(input)` as `media: ReviewMediaInput[]`
- [ ] Backend enforces: purchase required, one review per product, rating 1—5

### Review Edit/Delete

- [ ] `MutationProvider` with `reviewsApi.update()`
- [ ] `MutationProvider` with `reviewsApi.delete()`
- [ ] Reuse form components in edit mode
- [ ] Delete confirmation trigger

### Review Stats Display

- [ ] `product-review-stats.tsx` — Query wrapping `reviewStats` from Product
- [ ] Average rating, total count, rating distribution (1—5)

### Auth Gate

- [ ] Wrap form in auth gate (only authenticated users can review)
- [ ] Show "Login to review" prompt for guests

## Usage (target)

```tsx
<Product>
  <ProductReviewStats />

  <ProductReviewList>
    <ProductReviewListContent>
      <ProductReviewListView class="space-y-4">
        <ProductReviewListItem>
          <div class="flex items-center gap-2">
            <ProductReviewListItemStars />
            <ProductReviewListItemAuthor />
            <ProductReviewListItemDate />
          </div>
          <ProductReviewListItemComment />
          <ProductReviewListItemMedia>
            <ProductReviewListItemMediaContent>
              <ProductReviewListItemMediaView class="flex gap-2">
                <ProductReviewListItemMediaItem class="size-20 rounded-md" />
              </ProductReviewListItemMediaView>
            </ProductReviewListItemMediaContent>
          </ProductReviewListItemMedia>
        </ProductReviewListItem>
      </ProductReviewListView>
    </ProductReviewListContent>
    <ProductReviewListEmptyView />
  </ProductReviewList>

  <ProductReviewForm onSuccess={refetch}>
    <ProductReviewFormStars />
    <ProductReviewFormTitle />
    <ProductReviewFormComment />
    <ProductReviewFormMedia>
      <FileFieldDropzone />
    </ProductReviewFormMedia>
    <ProductReviewFormSubmit>Submit Review</ProductReviewFormSubmit>
    <ProductReviewFormError />
  </ProductReviewForm>
</Product>
```
