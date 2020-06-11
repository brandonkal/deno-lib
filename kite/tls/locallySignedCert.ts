/**
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license Not Provided. Contact for details.
 */
// *** WARNING: this file was generated by the Kite™️ Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as kite from 'https://deno.land/x/lib/kite.ts'

/**
 * > This content is derived from https://github.com/terraform-providers/terraform-provider-tls/blob/master/website/docs/r/locally_signed_cert.html.md.
 */
export class LocallySignedCert extends kite.Resource {
	/**
	 * List of keywords each describing a use that is permitted
	 * for the issued certificate. The valid keywords are listed below.
	 */
	public readonly allowedUses!: string[]
	/**
	 * PEM-encoded certificate data for the CA.
	 */
	public readonly caCertPem!: string
	/**
	 * The name of the algorithm for the key provided
	 * in `caPrivateKeyPem`.
	 */
	public readonly caKeyAlgorithm!: string
	/**
	 * PEM-encoded private key data for the CA.
	 * This can be read from a separate file using the ``file`` interpolation
	 * function.
	 */
	public readonly caPrivateKeyPem!: string
	/**
	 * The certificate data in PEM format.
	 */
	public readonly /*out*/ certPem!: string
	/**
	 * PEM-encoded request certificate data.
	 */
	public readonly certRequestPem!: string
	/**
	 * Number of hours before the certificates expiry when a new certificate will be generated
	 */
	public readonly earlyRenewalHours!: number | undefined
	/**
	 * Boolean controlling whether the CA flag will be set in the
	 * generated certificate. Defaults to `false`, meaning that the certificate does not represent
	 * a certificate authority.
	 */
	public readonly isCaCertificate!: boolean | undefined
	public readonly /*out*/ readyForRenewal!: boolean
	/**
	 * If `true`, the certificate will include
	 * the subject key identifier. Defaults to `false`, in which case the subject
	 * key identifier is not set at all.
	 */
	public readonly setSubjectKeyId!: boolean | undefined
	/**
	 * The time until which the certificate is invalid, as an
	 * [RFC3339](https://tools.ietf.org/html/rfc3339) timestamp.
	 */
	public readonly /*out*/ validityEndTime!: string
	/**
	 * The number of hours after initial issuing that the
	 * certificate will become invalid.
	 */
	public readonly validityPeriodHours!: number
	/**
	 * The time after which the certificate is valid, as an
	 * [RFC3339](https://tools.ietf.org/html/rfc3339) timestamp.
	 */
	public readonly /*out*/ validityStartTime!: string

	/**
	 * Create a LocallySignedCert resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 */
	constructor(name: string, args: LocallySignedCertArgs) {
		let inputs: any = {}
		if (!args || args.allowedUses === undefined) {
			throw new Error("Missing required property 'allowedUses'")
		}
		if (!args || args.caCertPem === undefined) {
			throw new Error("Missing required property 'caCertPem'")
		}
		if (!args || args.caKeyAlgorithm === undefined) {
			throw new Error("Missing required property 'caKeyAlgorithm'")
		}
		if (!args || args.caPrivateKeyPem === undefined) {
			throw new Error("Missing required property 'caPrivateKeyPem'")
		}
		if (!args || args.certRequestPem === undefined) {
			throw new Error("Missing required property 'certRequestPem'")
		}
		if (!args || args.validityPeriodHours === undefined) {
			throw new Error("Missing required property 'validityPeriodHours'")
		}
		inputs.allowedUses = args ? args.allowedUses : undefined
		inputs.caCertPem = args ? args.caCertPem : undefined
		inputs.caKeyAlgorithm = args ? args.caKeyAlgorithm : undefined
		inputs.caPrivateKeyPem = args ? args.caPrivateKeyPem : undefined
		inputs.certRequestPem = args ? args.certRequestPem : undefined
		inputs.earlyRenewalHours = args ? args.earlyRenewalHours : undefined
		inputs.isCaCertificate = args ? args.isCaCertificate : undefined
		inputs.setSubjectKeyId = args ? args.setSubjectKeyId : undefined
		inputs.validityPeriodHours = args ? args.validityPeriodHours : undefined
		super(name, inputs)
		this.setType(LocallySignedCert.__kiteType)
		this.certPem = `(( tf ${this.id()}.cert_pem ))` as any /*out*/
		this.readyForRenewal = `(( tf ${this.id()}.ready_for_renewal | boolean ))` as any /*out*/
		this.validityEndTime = `(( tf ${this.id()}.validity_end_time ))` as any /*out*/
		this.validityStartTime = `(( tf ${this.id()}.validity_start_time ))` as any /*out*/
	}
	/**
	 * Used to map camelCased properties to Terraform snake_case
	 * @internal
	 */
	static convertMap: Record<string, string> = {
		allowedUses: 'allowed_uses',
		caCertPem: 'ca_cert_pem',
		caKeyAlgorithm: 'ca_key_algorithm',
		caPrivateKeyPem: 'ca_private_key_pem',
		certRequestPem: 'cert_request_pem',
		earlyRenewalHours: 'early_renewal_hours',
		isCaCertificate: 'is_ca_certificate',
		setSubjectKeyId: 'set_subject_key_id',
		validityPeriodHours: 'validity_period_hours',
		certPem: 'undefined',
		readyForRenewal: 'undefined',
		validityEndTime: 'undefined',
		validityStartTime: 'undefined',
	}

	/**
	 * Transforms the Resource instance into the Terraform JSON representation.
	 * @internal
	 */
	convert() {
		const props: any = {}
		Object.entries(this).forEach(([key, value]) => {
			const newKey = LocallySignedCert.convertMap[key]
			if (!newKey) {
				throw new Error(
					`Could not print key: ${key}. Not found in ${
						(this as any).__type
					} spec.`
				)
			}
			if (newKey !== 'undefined' /* out */) {
				props[newKey] = value
			}
		})
		return {
			terraform: {
				required_providers: {
					tls: '~> 2.1',
				},
			},
			resource: {
				tls_locally_signed_cert: { [this.__name]: props },
			},
		}
	}

	/** @internal */
	public static readonly __kiteType =
		'tf:tls:index/locallySignedCert:LocallySignedCert'
	/** @internal */
	public static readonly __tfType = 'tls_locally_signed_cert'

	/** @internal */
	public id() {
		return LocallySignedCert.__tfType + '.' + this.__name
	}
}

/**
 * The set of arguments for constructing a LocallySignedCert resource.
 */
export interface LocallySignedCertArgs {
	/**
	 * List of keywords each describing a use that is permitted
	 * for the issued certificate. The valid keywords are listed below.
	 */
	readonly allowedUses: string[]
	/**
	 * PEM-encoded certificate data for the CA.
	 */
	readonly caCertPem: string
	/**
	 * The name of the algorithm for the key provided
	 * in `caPrivateKeyPem`.
	 */
	readonly caKeyAlgorithm: string
	/**
	 * PEM-encoded private key data for the CA.
	 * This can be read from a separate file using the ``file`` interpolation
	 * function.
	 */
	readonly caPrivateKeyPem: string
	/**
	 * PEM-encoded request certificate data.
	 */
	readonly certRequestPem: string
	/**
	 * Number of hours before the certificates expiry when a new certificate will be generated
	 */
	readonly earlyRenewalHours?: number
	/**
	 * Boolean controlling whether the CA flag will be set in the
	 * generated certificate. Defaults to `false`, meaning that the certificate does not represent
	 * a certificate authority.
	 */
	readonly isCaCertificate?: boolean
	/**
	 * If `true`, the certificate will include
	 * the subject key identifier. Defaults to `false`, in which case the subject
	 * key identifier is not set at all.
	 */
	readonly setSubjectKeyId?: boolean
	/**
	 * The number of hours after initial issuing that the
	 * certificate will become invalid.
	 */
	readonly validityPeriodHours: number
}
